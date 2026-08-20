import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <span className="not-found-icon">🧭</span>
        <h1>404 - Page Not Found</h1>
        <p>The study material or page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary btn-md">
          🏠 Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
