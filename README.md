Here’s the complete and well-structured `README.md` file for your **Code Debugging Battle (CDB)** project:

---


# 🧠 Code Debugging Battle (CDB)

**Code Debugging Battle (CDB)** is a real-time competitive programming platform where users can participate in live debugging contests, improve their coding skills, and climb the leaderboard. It features secure user authentication, interactive battle modes, real-time code evaluation, and performance insights.

---

## 🚀 Features

- 🔐 **User Authentication & Authorization**
  - JWT-based authentication
  - Separate roles for Users and Admins

- ⚔️ **Battle Modes**
  - 1v1 Debugging Battles
  - Solo Debug Practice
  - Timed Code Fix Challenges

- ⚡ **Real-time Problem Solving**
  - Socket.io-powered live code submission and opponent tracking
  - Real-time score updates

- 🛠️ **Admin Panel**
  - Manage users and problems
  - Track platform activity

- 📊 **Leaderboard System**
  - Live global and mode-specific rankings
  - Scoring system based on performance

- 🔁 **Replay & Feedback**
  - Watch past battles
  - Analyze mistakes and performance metrics

---

## 🧩 Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **Socket.io** for real-time communication
- **JWT** for authentication
- **Joi** for validation


---

## 🔄 Data Flow Diagrams (DFD)

- **Level 0 (Context Diagram)**: External entities like `User` and `Admin` interact with the system.
- **Level 1**: Includes Authentication, Problem Management, Battle Handling, Code Evaluation, and Leaderboard.
- **Level 2**: Subsystems like real-time battle sync, code comparison engine, and submission handling.
- **Level 3 (Optional)**: Detailed flow of real-time interactions using Socket.io and evaluation logic.

---

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/KaranChavda511/CDB-A-Competitive-Coding-Platform.git
cd cdb-backend
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

```env
PORT=2001
MONGO_URI= your_URI
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173/
LOG_FILE_PATH=logs/app.log
```

### 4. Run the Server

```bash
npm run dev
```



---

## ✅ Future Enhancements

* 💡 AI-powered debugging suggestions
* 📱 Mobile-responsive frontend
* 🎯 Ranked matchmaking system
* 🎨 Monaco-based code editor

---





