// import React, { useEffect } from 'react';
// import { useSocket as useSocketContext } from '../contexts/SocketContext.jsx';
// import { toast } from 'react-hot-toast';

// // Enhanced socket hook with reconnect logic
// const useSocket = () => {
//   const socket = useSocketContext();

//   // useEffect(() => {
//   //   if (socket) {
//   //     const handleConnectError = (err) => {
//   //       toast.error(`Connection error: ${err.message}`);
//   //     };

//   //     const handleReconnectAttempt = (attempt) => {
//   //       toast.loading(`Reconnecting (attempt ${attempt})...`);
//   //     };

//   //     socket.on('connect_error', handleConnectError);
//   //     socket.on('reconnect_attempt', handleReconnectAttempt);

//   //     return () => {
//   //       socket.off('connect_error', handleConnectError);
//   //       socket.off('reconnect_attempt', handleReconnectAttempt);
//   //     };
//   //   }
//   // }, [socket]);



//   // useSocket.js hook mein ye add karo
//   useEffect(() => {
//     const socketInstance = io("http://localhost:2001", {
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });

//     socketInstance.on("connect", () => {
//       console.log("Socket connected!");
//       setSocket(socketInstance);
//     });

//     socketInstance.on("connect_error", (err) => {
//       console.log("Socket connection error:", err);
//     });

//     return () => {
//       socketInstance.disconnect();
//     };
//   }, []);


//   return {
//     socket,
//     isConnected: socket?.connected || false
//   };
// };

// export default useSocket;





import { useEffect, useState } from 'react';
import socket from '../services/socket';

// const useSocket = () => {
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     // Connect manually
//     socket.connect();

//     socket.on('connect', () => {
//       setIsConnected(true);
//       console.log('Socket connected!');
//     });

//     socket.on('disconnect', () => {
//       setIsConnected(false);
//     });

//     return () => {
//       socket.off('connect');
//       socket.off('disconnect');
//       socket.disconnect();
//     };
//   }, []);

//   return { socket, isConnected };
// };

import { io } from 'socket.io-client';

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Use correct backend URL (5000 instead of 2001)
    const socketInstance = io('http://localhost:2001', {
      withCredentials: true,
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      setSocket(socketInstance);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, isConnected };
};


export default useSocket;