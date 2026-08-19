import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <h2>AI Study Assistant</h2>

      <nav>

        <Link to="/">
          🏠 Dashboard
        </Link>

        <Link to="/chat">
          🤖 AI Chat
        </Link>

        <Link to="/materials">
          📚 Study Materials
        </Link>

        <Link to="/quiz">
          📝 Quiz
        </Link>

        <Link to="/progress">
          📊 Progress
        </Link>

        <Link to="/settings">
          ⚙️ Settings
        </Link>

      </nav>

    </aside>
  );
}

export default Sidebar;