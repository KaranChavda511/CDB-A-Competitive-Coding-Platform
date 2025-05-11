import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:2001', {
  withCredentials: true,
  autoConnect: false, // Manual connection
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

export default socket;