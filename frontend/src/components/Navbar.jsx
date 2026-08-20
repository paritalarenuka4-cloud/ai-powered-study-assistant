import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="menu-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-name">AI Study Assistant</span>
        </Link>
      </div>

      <div className="navbar-right">
        <div className="ai-badge">
          <span className="ai-status-dot"></span>
          <span>AI Engine Ready</span>
        </div>

        {user ? (
          <div className="user-profile-widget">
            <Link to="/settings" className="user-profile-btn">
              <span className="user-avatar">{user.avatar || '👨‍🎓'}</span>
              <span className="user-name">{user.name}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="logout-nav-btn"
              title="Sign Out"
            >
              🚪
            </button>
          </div>
        ) : (
          <div className="auth-nav-buttons">
            <Link to="/login" className="login-btn-outline">
              Sign In
            </Link>
            <Link to="/register" className="register-btn-solid">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
