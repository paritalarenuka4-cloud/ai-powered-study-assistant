import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: '🏠' },
    { to: '/chat', label: 'AI Study Assistant', icon: '🤖', badge: 'AI' },
    { to: '/materials', label: 'Study Materials', icon: '📚' },
    { to: '/quiz', label: 'Take Quiz', icon: '📝' },
    { to: '/progress', label: 'Progress & Stats', icon: '📊' },
    { to: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-group">
            <span className="logo-icon">🚀</span>
            <div>
              <h2 className="logo-title">Study Assistant</h2>
              <span className="logo-subtitle">Smart Learning Hub</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </NavLink>
          ))}
        </nav>

        {user && (
          <div className="sidebar-footer">
            <div className="user-mini-card">
              <div className="avatar-circle">{user.avatar || '🎓'}</div>
              <div className="user-info">
                <p className="name">{user.name}</p>
                <p className="email">{user.email}</p>
              </div>
            </div>
            <button className="sidebar-logout-btn" onClick={logout}>
              <span>Sign Out</span>
              <span>👋</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;