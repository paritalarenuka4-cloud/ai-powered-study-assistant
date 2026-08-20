# 🎓 AI-Powered Study Assistant

An intelligent, full-stack educational web application designed to help students master subjects through personalized study dashboards, AI-assisted tutoring, curated study materials, interactive quizzes, and comprehensive progress tracking.

---

## 🏗️ High-Level Architecture

```text
Browser / Client (React + Vite) [Port 5173]
       │
       │ HTTP REST API (JWT Bearer Auth)
       ▼
Node.js + Express Backend [Port 5000]
       │
       ├─────────────────────┬─────────────────────┐
       ▼                     ▼                     ▼
MongoDB Database        AI Service          Authentication
(Mongoose Schemas:      (LLM Provider       (bcryptjs + JWT)
 Users, Materials,       + Offline Heuristic
 Quizzes, Progress)      Engine)
```

---

## 📂 Project Structure

```text
ai-powered-study-assistant/
├── frontend/                     # React + Vite Client
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/           # Reusable UI components (Navbar, Sidebar, Card, Button, Modal, etc.)
│   │   ├── context/              # AuthContext (JWT session management)
│   │   ├── pages/                # Views (Dashboard, Chat, Materials, Quiz, Progress, Settings)
│   │   ├── services/             # Centralized API service layer (api.js)
│   │   ├── App.css               # Global responsive design system
│   │   ├── App.jsx               # Routes & protected layouts
│   │   ├── index.css             # Base design tokens
│   │   └── main.jsx              # React root entry
│   ├── .env.example              # Frontend env template
│   └── package.json              # Frontend dependencies
│
├── backend/                      # Node.js + Express + MongoDB Server
│   ├── config/                   # Database connection (db.js)
│   ├── controllers/              # Business logic (auth, materials, quiz, chat, progress)
│   ├── middleware/               # Auth (JWT protect) & Error middleware
│   ├── models/                   # Mongoose schemas (User, Subject, Material, Quiz, Chat, Activity)
│   ├── routes/                   # REST endpoints (/api/*)
│   ├── services/                 # AI service integration (aiService.js)
│   ├── seed.js                   # MongoDB seed script
│   ├── server.js                 # Express server entry point
│   ├── .env.example              # Backend env template
│   └── package.json              # Backend dependencies
│
├── README.md                     # Project documentation
└── .gitignore                    # Root git ignore
```

---

## ⚙️ Prerequisites

Make sure you have the following installed on your system:
- **Node.js**: v18.x or newer ([Download Node.js](https://nodejs.org/))
- **npm**: v9.x or newer
- **MongoDB**: Local MongoDB community server (e.g., `mongodb://127.0.0.1:27017`) or MongoDB Atlas URI.

---

## 🚀 Getting Started

### 1. Backend Setup & Seeding

1. Open a terminal and navigate to `backend/`:
   ```powershell
   cd backend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Copy environment variables:
   ```powershell
   copy .env.example .env
   ```
4. Seed the MongoDB database with sample subjects, study materials, and quizzes:
   ```powershell
   npm run seed
   ```
5. Start the backend development server:
   ```powershell
   npm run dev
   ```
   Server will run at: **http://localhost:5000**

---

### 2. Frontend Setup

1. Open another terminal and navigate to `frontend/`:
   ```powershell
   cd frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the Vite development server:
   ```powershell
   npm run dev
   ```
   Open your browser at: **http://localhost:5173**

---

## 🔑 Demo Account

You can sign in with the pre-seeded demo student account:
- **Email:** `student@example.com`
- **Password:** `password123`

Or register a new account on the `/register` screen.

---

## 📡 REST API Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend status & health check |
| `POST` | `/api/auth/register` | Register new student account |
| `POST` | `/api/auth/login` | Authenticate student and get JWT |
| `GET` | `/api/auth/me` | Fetch active user profile (Protected) |
| `GET` | `/api/materials` | Search and filter study materials |
| `POST` | `/api/materials/generate` | Generate study notes using AI |
| `GET` | `/api/quizzes` | List available quizzes |
| `POST` | `/api/quizzes/generate` | Generate custom quiz using AI |
| `POST` | `/api/quizzes/:id/submit`| Submit answers & compute score |
| `POST` | `/api/chat` | Send prompt to AI Study Assistant |
| `GET` | `/api/progress` | Get student study metrics & mastery |