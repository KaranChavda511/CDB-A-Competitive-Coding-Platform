// src/routes/multiplayerGameRoutes.js
import express from "express";
import {
  createMultiplayerRoom,
  joinMultiplayerRoom,
  startMultiplayerGame,
  submitMultiplayerSolution,
  getRoomDetails,
  leaveRoom,
} from "../controllers/multiplayerGameController.js";
import isLoggedIn from "../middlewares/authMiddleware.js";
import MultiplayerSession from "../models/multiplayerSession.models.js"
import logger from "../utils/logger.js";

const router = express.Router();

// yaha par memne get route likhe hai,

// Get all multiplayer rooms
router.get("/rooms", isLoggedIn, async (req, res) => {
  try {
    // const rooms = await MultiplayerSession.find()
    //   .populate("owner", "username")
    //   .populate("players.user", "username");


    const rooms = await MultiplayerSession.find({ status: "waiting" })
      .populate({ path: "owner", select: "username" })
      .populate({ path: "players.user", select: "username" }) 
      .lean(); 

    console.log("Fetched Rooms:", rooms); 

    res.status(200).json({ rooms });
    // res.status(200).json({ rooms: rooms.length ? rooms : [] });

  } catch (error) {

    console.error("Error in /rooms route:", error);

    logger.error(`Fetch Multiplayer Rooms Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



router.use((req, res, next) => {
  logger.info(`Multiplayer route: ${req.method} ${req.url}`);
  next();
});

// Create room
router.post("/rooms", isLoggedIn, createMultiplayerRoom);
// Get room details
router.get('/rooms/:roomId', isLoggedIn, getRoomDetails);
// Join room
router.post("/rooms/:roomId/join", isLoggedIn, joinMultiplayerRoom);
// Leave room
router.post('/rooms/:roomId/leave', isLoggedIn, leaveRoom);
// Start game
router.post("/rooms/:roomId/start", isLoggedIn, startMultiplayerGame);
// Submit solution
router.post("/submit", isLoggedIn, submitMultiplayerSolution);

export default router;
