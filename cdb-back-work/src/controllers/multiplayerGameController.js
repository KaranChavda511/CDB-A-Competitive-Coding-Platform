// src/controllers/multiplayerGameController.js
import MultiplayerSession from "../models/multiplayerSession.models.js";
import Challenge from "../models/challenge.models.js";
import logger from "../utils/logger.js";
import { executeSolution } from "../services/codeExecutor.js";




// Updated createMultiplayerRoom controller
export const createMultiplayerRoom = async (req, res) => {
  try {
    let { challenges } = req.body;
    const userId = req.user.id;
    const roomName = req.body.roomName || "Quick Match";

     // Improved dummy challenge handling
     if (!challenges?.length) {
      let dummyChallenge = await Challenge.findOne({ title: "Dummy Challenge" });
      
      if (!dummyChallenge) {
        dummyChallenge = await Challenge.create({
          title: "Dummy Challenge",
          description: "Add two numbers",
          functionName: "add",
          testCases: [{ input: "[1,2]", output: "3" }],
          expectedOutput: "3",
          difficulty: "easy"
        });
      }
      challenges = [dummyChallenge._id];
    }

    // Generate unique room ID
    const newSession = await MultiplayerSession.create({
      roomId: `room-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      roomName: roomName || "Quick Match",
      owner: userId,
      challenges,
      players: [{ user: userId, ready: false }],
      status: "waiting"
    });

    req.app.get('io').emit('room-created', newSession);
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





// Join a multiplayer room

export const joinMultiplayerRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const session = await MultiplayerSession.findOne({roomId});
    
    if (!session) return res.status(404).json({ error: "Room not found" });
    if (session.players.length >= 4) return res.status(400).json({ error: "Room full" });
    
    session.players.push({ user: req.user.id, ready: false });
    await session.save();
    
    req.app.get('io').to(roomId).emit('player-joined', session);
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Start the multiplayer game
export const startMultiplayerGame = async (req, res) => {
  try {
    const { roomId } = req.params;
    const session = await MultiplayerSession.findOne( {roomId} )
    .populate('challenges');

    // Add validation for challenges array
    if (!session.challenges?.length) {
      return res.status(400).json({ message: "No challenges in this room" });
    }


    if (!session) {
      return res.status(404).json({ message: "Room not found" });
    }
    if (session.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the room owner can start the game" });
    }
    if (session.players.length < 2) {
      return res.status(400).json({ message: "At least 2 players are required to start the game" });
    }
    session.status = "active";
    session.currentChallengeIndex = 0;
    session.challengeStartTime = new Date();
    await session.save();

    req.app.get('io').to(roomId).emit('game-started', session);
    logger.info(`Game started in room ${roomId} by owner ${req.user.id}`);
    res.status(200).json({ message: "Game started", session });
  } catch (error) {
    logger.error(`Start Multiplayer Game Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Submit a solution for the current challenge
export const submitMultiplayerSolution = async (req, res) => {
  try {
    const { roomId, code } = req.body;
    const session = await MultiplayerSession.findOne( {roomId} );


       // Add current challenge validation
       if (session.currentChallengeIndex >= session.challenges.length) {
        return res.status(400).json({ message: "No active challenge" });
      }


    if (!session) {
      return res.status(404).json({ message: "Room not found" });
    }
    if (session.status !== "active") {
      return res.status(400).json({ message: "Game is not active" });
    }
    const currentChallengeId = session.challenges[session.currentChallengeIndex];
    const challenge = await Challenge.findById(currentChallengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    const result = await executeSolution(code, challenge);
    const submissionTime = new Date();
    const player = session.players.find(p => p.user.toString() === req.user.id);
    if (!player) {
      return res.status(400).json({ message: "Player not in room" });
    }
    if (player.submissions.some(s => s.challengeId.toString() === currentChallengeId.toString())) {
      return res.status(400).json({ message: "Already submitted for this challenge" });
    }
    player.submissions.push({
      challengeId: currentChallengeId,
      code,
      correct: result.success,
      submissionTime,
    });
    await session.save();
    logger.info(`User ${req.user.id} submitted solution for challenge ${currentChallengeId} in room ${roomId}`);
    res.status(200).json({ message: "Solution submitted", result });
  } catch (error) {
    logger.error(`Submit Multiplayer Solution Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRoomDetails = async (req, res) => {
  try {
    const { roomId } = req.params;
    const session = await MultiplayerSession.findOne({roomId})
      .populate("owner", "username")
      .populate({ path: "players.user", select: "username" })
      .populate("challenges")
      .lean(); 
    if (!session) {
      return res.status(404).json({ message: "Room not found" });
    }
    const currentChallenge = session.challenges[session.currentChallengeIndex];
    const timeLeft = session.timerDuration - Math.floor((Date.now() - session.challengeStartTime) / 1000);
    const isChallengeActive = timeLeft > 0;
    const challengeDetails = {
      ...currentChallenge,
      timeLeft: isChallengeActive ? timeLeft : 0,
      isChallengeActive,
    };
    res.status(200).json({ session, challengeDetails });
  } catch (error) {
    logger.error(`Get Room Details Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const session = await MultiplayerSession.findById(roomId);
    if (!session) {
      return res.status(404).json({ message: "Room not found" });
    }
    session.players = session.players.filter(player => player.user.toString() !== req.user.id.toString());
    if (session.players.length === 0) {
      await session.remove();
      req.app.get('io').emit('room-deleted', roomId);
    } else {
      await session.save();
      req.app.get('io').to(roomId).emit('player-left', session);
    }
    res.status(200).json({ message: "Left room successfully" });
  } catch (error) {
    logger.error(`Leave Room Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// Helper: End current challenge (compute rankings and advance game)
export const endCurrentChallenge = async (session) => {
  try {
    const currentChallengeId = session.challenges[session.currentChallengeIndex];
    const submissions = [];
    session.players.forEach(player => {
      const submission = player.submissions.find(s => s.challengeId.toString() === currentChallengeId.toString());
      if (submission && submission.correct) {
        submissions.push({ user: player.user, submissionTime: submission.submissionTime });
      }
    });
    submissions.sort((a, b) => new Date(a.submissionTime) - new Date(b.submissionTime));
    session.results.push({
      challengeId: currentChallengeId,
      rankings: submissions,
    });
    if (session.currentChallengeIndex < session.challenges.length - 1) {
      session.currentChallengeIndex += 1;
      session.challengeStartTime = new Date();
    } else {
      session.status = "completed";
    }
    await session.save();
    return session;
  } catch (error) {
    logger.error(`End Challenge Error: ${error.message}`);
    throw error;
  }
};
