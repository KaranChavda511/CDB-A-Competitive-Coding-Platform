// import React,{ useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import  useSocket  from '../../hooks/useSocket.js';
// import { toast } from 'react-hot-toast';
// import API from '../../services/api.js';
// import './Lobby.css'

// const Lobby = () => {
//   const [rooms, setRooms] = useState([]);
//   const [newRoomName, setNewRoomName] = useState('');
//   const [isCreating, setIsCreating] = useState(false);
//   const { socket } = useSocket();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const { data } = await API.get('/multiplayer/rooms');
//         setRooms(data);
//       } catch (error) {
//         toast.error('Failed to load rooms');
//       }
//     };

//     fetchRooms();

//     if (socket) {
//       socket.on('roomCreated', (room) => {
//         setRooms(prev => [...prev, room]);
//       });

//       socket.on('roomJoined', (roomId) => {
//         navigate(`/multiplayer/${roomId}`);
//       });

//       socket.on('roomListUpdate', (updatedRooms) => {
//         setRooms(updatedRooms);
//       });
//     }

//     return () => {
//       if (socket) {
//         socket.off('roomCreated');
//         socket.off('roomJoined');
//         socket.off('roomListUpdate');
//       }
//     };
//   }, [socket, navigate]);

//   const handleCreateRoom = async () => {
//     if (!newRoomName.trim()) {
//       toast.error('Room name cannot be empty');
//       return;
//     }

//     setIsCreating(true);
//     try {
//       const { data } = await API.post('/multiplayer/room', {
//         roomName: newRoomName,
//         challenges: [], // In real app, you'd select challenges
//       });
//       socket.emit('joinRoom', data.roomId);
//       setNewRoomName('');
//     } catch (error) {
//       toast.error('Failed to create room');
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   const handleJoinRoom = (roomId) => {
//     socket.emit('joinRoom', roomId);
//   };

//   return (
//     <div className="multiplayer-lobby">
//       <h2>Multiplayer Lobby</h2>

//       <div className="create-room">
//         <input
//           value={newRoomName}
//           onChange={(e) => setNewRoomName(e.target.value)}
//           placeholder="Enter room name"
//         />
//         <button 
//           onClick={handleCreateRoom} 
//           disabled={isCreating}
//           className="create-btn"
//         >
//           {isCreating ? 'Creating...' : 'Create Room'}
//         </button>
//       </div>

//       <div className="room-list">
//         <h3>Available Rooms</h3>
//         {rooms.length === 0 ? (
//           <p>No rooms available. Create one!</p>
//         ) : (
//           <ul>
//             {rooms.map(room => (
//               <li key={room._id} className="room-item">
//                 <div className="room-info">
//                   <span className="room-name">{room.roomName}</span>
//                   <span className="room-players">
//                     {room.players.length}/5 players
//                   </span>
//                 </div>
//                 <button 
//                   onClick={() => handleJoinRoom(room._id)}
//                   disabled={room.players.length >= 5}
//                   className="join-btn"
//                 >
//                   {room.players.length >= 5 ? 'Full' : 'Join'}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Lobby;






// iss code ke niche aur sahi code likha hai.
// yaha se new css vala code hai.

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import useSocket from '../../hooks/useSocket.js';
// import { toast } from 'react-hot-toast';
// import API from '../../services/api.js';
// import './Lobby.css'

// const Lobby = () => {
//   const [rooms, setRooms] = useState([]);
//   const [newRoomName, setNewRoomName] = useState('');
//   const [isCreating, setIsCreating] = useState(false);
//   // const { socket } = useSocket();
//   const { socket, isConnected } = useSocket(); // Updated usage
//   const navigate = useNavigate();

//   useEffect(() => {
//     // const fetchRooms = async () => {
//     //   try {
//     //     const { data } = await API.get('/multiplayer/rooms');
//     //     // const { data } = await API.get('/multiplayer/room');
//     //     setRooms(data);
//     //   } catch (error) {
//     //     toast.error('Failed to load rooms');
//     //   }
//     // };

//     const fetchRooms = async () => {
//       try {
//         // const { data } = await API.get('/multiplayer/rooms');
//         const { data } = await API.get('/multiplayer/room');
//         if (data.rooms) {
//           setRooms(data.rooms);
//         } else {
//           setRooms([]); // fallback
//         }
//       } catch (error) {
//         console.error("Error fetching rooms:", error);
//         setRooms([]); // fallback on failure
//       }
//     };

//     fetchRooms();

//     if (socket) {
//       socket.on('roomCreated', (room) => {
//         setRooms(prev => [...prev, room]);
//       });

//       socket.on('roomJoined', (roomId) => {
//         navigate(`/multiplayer/${roomId}`);
//       });

//       socket.on('roomListUpdate', (updatedRooms) => {
//         setRooms(updatedRooms);
//       });
//     }

//     return () => {
//       if (socket) {
//         socket.off('roomCreated');
//         socket.off('roomJoined');
//         socket.off('roomListUpdate');
//       }
//     };
//   }, [socket, navigate]);

//   // const handleCreateRoom = async () => {
//   //   if (!newRoomName.trim()) {
//   //     toast.error('Room name cannot be empty');
//   //     return;
//   //   }

//   //   setIsCreating(true);
//   //   try {
//   //     const { data } = await API.post('/multiplayer/room', {
//   //     // const { data } = await API.post('/multiplayer/rooms', {
//   //       roomName: newRoomName,
//   //       // challenges: [], // yaha par empty challenges bhej rahe hai isliye problem aa rhai hai
//   //       challenges: [
//   //         {
//   //           title: "Dummy Challenge",
//   //           description: "Solve this test challenge!",
//   //           input: "2 3",
//   //           output: "5"
//   //         }
//   //       ], // now yaha par ham ek dummy challenge bhej ke chake karte hai ki kaam ho raha hai ki nahi
//   //     });
//   //     socket.emit('joinRoom', data.roomId);
//   //     setNewRoomName('');
//   //   } catch (error) {
//   //     toast.error('Failed to create room');
//   //   } finally {
//   //     setIsCreating(false);
//   //   }
//   // };





//   const handleCreateRoom = async () => {
//     if (!newRoomName.trim()) {
//       toast.error('Room name cannot be empty');
//       return;
//     }
  
//     setIsCreating(true);
//     try {
//       // First get a challenge ID (replace with your actual challenge selection logic)
//       const { data: challenge } = await API.get('/api/challenges?limit=1');
//       const challengeId = challenge[0]?._id;
  
//       if (!challengeId) {
//         throw new Error('No challenges available');
//       }
  
//       const { data } = await API.post('/multiplayer/rooms', {
//         roomName: newRoomName,
//         challenges: [challengeId] // Send only the ID
//       });
  
//       if (socket) {
//         socket.emit('joinRoom', data._id); // Use data._id instead of data.roomId
//         navigate(`/multiplayer/${data._id}`); // Redirect immediately
//       }
      
//       setNewRoomName('');
//     } catch (error) {
//       console.error('Room creation error:', error);
//       toast.error(error.response?.data?.message || 'Failed to create room');
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   const handleJoinRoom = (roomId) => {
//     socket.emit('joinRoom', roomId);
//   };

//   return (
//     <div className="multiplayer-lobby">
//       <h2>Multiplayer Lobby 🎮</h2>

//       <div className="create-room">
//         <input
//           value={newRoomName}
//           onChange={(e) => setNewRoomName(e.target.value)}
//           placeholder="Enter room name"
//         />
//         <button
//           onClick={handleCreateRoom}
//           disabled={isCreating}
//           className="create-btn"
//         >
//           {isCreating ? 'Creating...' : 'Create Room'}
//         </button>
//       </div>

//       <div className="room-list">
//         <h3>Available Rooms</h3>
//         {rooms.length === 0 ? (
//           <p>No rooms available. Create one! 🧪</p>
//         ) : (
//           <ul>
//             {rooms.map(room => (
//               <li key={room._id} className="room-item">
//                 <div className="room-info">
//                   <span className="room-name">{room.roomName}</span>
//                   <span className="room-players">
//                     {room.players.length}/5 players
//                     {room.players.length >= 5 && (
//                       <span className="room-full-badge">Full</span>
//                     )}
//                   </span>
//                   <div className="player-avatars">
//                     {room.players.map((p, i) => (
//                       <div key={i} className="player-avatar">
//                         {p.username?.charAt(0).toUpperCase() || '?'}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => handleJoinRoom(room._id)}
//                   disabled={room.players.length >= 5}
//                   className="join-btn"
//                 >
//                   {room.players.length >= 5 ? 'Full' : 'Join'}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Lobby;















import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSocket from '../../hooks/useSocket.js';
import { toast } from 'react-hot-toast';
import API from '../../services/api.js';
import './Lobby.css';

const Lobby = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();

  // Fetch rooms and setup socket listeners
  useEffect(() => {
    // const fetchRooms = async () => {
    //   try {
    //     const { data } = await API.get('/api/multiplayer/room');
    //     setRooms(data.rooms || []);
    //   } catch (error) {
    //     console.error("Error fetching rooms:", error);
    //     toast.error('Failed to load rooms');
    //     setRooms([]);
    //   }
    // };

    const fetchRooms = async () => {
  try {
    // Correct endpoint (remove duplicate /api)
    const { data } = await API.get('/multiplayer/rooms');
    setRooms(data.rooms || []);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    toast.error('Failed to load rooms');
    setRooms([]);
  }
};

    fetchRooms();

    if (socket && isConnected) {
      // Setup socket listeners only when socket is connected
      socket.on('roomCreated', (room) => {
        setRooms(prev => [...prev, room]);
        toast.success(`Room ${room.roomName} created!`);
      });

      socket.on('roomJoined', ({ roomId, success }) => {
        if (success) {
          navigate(`/multiplayer/${roomId}`);
        } else {
          toast.error('Failed to join room');
        }
      });

      socket.on('roomListUpdate', (updatedRooms) => {
        setRooms(updatedRooms);
      });

      socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
        toast.error('Connection to game server lost');
      });
    }

    return () => {
      if (socket) {
        // Clean up all listeners
        socket.off('roomCreated');
        socket.off('roomJoined');
        socket.off('roomListUpdate');
        socket.off('connect_error');
      }
    };
  }, [socket, isConnected, navigate]);

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) {
      toast.error('Room name cannot be empty');
      return;
    }

    if (!isConnected) {
      toast.error('Not connected to game server');
      return;
    }

    setIsCreating(true);
    try {
      // Get first available challenge
      const { data: challenges } = await API.get('/challenges?limit=1');
      const challengeId = challenges[0]?._id;

      if (!challengeId) {
        throw new Error('No challenges available');
      }

      const { data } = await API.post('/multiplayer/rooms', {
        roomName: newRoomName,
        challenges: [challengeId]
      });

      // Join room through socket after creation
      socket.emit('joinRoom', { 
        roomId: data._id,
        username: data.owner.username // Send username if needed
      });

      setNewRoomName('');
    } catch (error) {
      console.error('Room creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to create room');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = (roomId) => {
    if (!isConnected) {
      toast.error('Not connected to game server');
      return;
    }

    if (socket) {
      socket.emit('joinRoom', { 
        roomId,
        username: 'currentUser' // Replace with actual username from auth
      });
    }
  };

  return (
    <div className="multiplayer-lobby">
      <h2>Multiplayer Lobby 🎮</h2>
      {!isConnected && (
        <div className="connection-warning">
          ⚠️ Connecting to game server...
        </div>
      )}

      <div className="create-room">
        <input
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="Enter room name"
          disabled={!isConnected}
        />
        <button
          onClick={handleCreateRoom}
          disabled={isCreating || !isConnected}
          className="create-btn"
        >
          {isCreating ? 'Creating...' : 'Create Room'}
        </button>
      </div>

      <div className="room-list">
        <h3>Available Rooms</h3>
        {rooms.length === 0 ? (
          <p>No rooms available. Create one! 🧪</p>
        ) : (
          <ul>
            {rooms.map(room => (
              <li key={room._id} className="room-item">
                <div className="room-info">
                  <span className="room-name">{room.roomName}</span>
                  <span className="room-players">
                    {room.players.length}/5 players
                    {room.players.length >= 5 && (
                      <span className="room-full-badge">Full</span>
                    )}
                  </span>
                </div>
                <button
                  onClick={() => handleJoinRoom(room._id)}
                  disabled={room.players.length >= 5 || !isConnected}
                  className="join-btn"
                >
                  {room.players.length >= 5 ? 'Full' : 'Join'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Lobby;