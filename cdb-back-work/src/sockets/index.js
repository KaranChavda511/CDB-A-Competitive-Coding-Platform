// src/sockets/index.js
import logger from "../utils/logger.js";
import handleRoomOperations from "./roomHandlers.js";
import multiplayerHandlers from "./multiplayerHandlers.js";

export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log('New client connected:', socket.id);
    logger.info(`New connection: ${socket.id}`);
    socket.on("joinRoom", handleRoomOperations.joinRoom(socket));
    socket.on("codeChange", handleRoomOperations.handleCodeChange(socket));
    socket.on("disconnectRoom", handleRoomOperations.disconnectRoom(socket));
    socket.on("leaveRoom", handleRoomOperations.leaveRoom(socket));
    socket.on("submitSolution", handleRoomOperations.handleSolution(socket));
    socket.on("mpJoinRoom", multiplayerHandlers.joinRoom(socket));
    socket.on("mpStartGame", (data) => multiplayerHandlers.startGame(socket, io)(data));
    socket.on("mpSubmitSolution", (data) => multiplayerHandlers.submitSolution(socket, io)(data));
    socket.on("disconnect", () => {
      logger.info(`Disconnected: ${socket.id}`);
      handleRoomOperations.cleanupRooms(socket);
    });
  });
};
