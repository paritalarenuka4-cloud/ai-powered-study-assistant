import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./components/Dashboard";

import Chat from "./pages/Chat";
import StudyMaterials from "./pages/StudyMaterials";
import Quiz from "./pages/Quiz";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>

      <div className="app">

        <Sidebar />

        <main className="main-content">

          <Routes>

            <Route path="/" element={<Dashboard />} />

            <Route path="/chat" element={<Chat />} />

            <Route
              path="/materials"
              element={<StudyMaterials />}
            />

            <Route
              path="/quiz"
              element={<Quiz />}
            />

            <Route
              path="/progress"
              element={<Progress />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

          </Routes>

        </main>

      </div>

    </BrowserRouter>
  );
}

export default App;