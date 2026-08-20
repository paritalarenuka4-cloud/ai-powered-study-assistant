function ErrorMessage({ message, onRetry, className = '' }) {
  if (!message) return null;

  return (
    <div className={`error-banner ${className}`}>
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <p className="error-text">{message}</p>
      </div>
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry}>
          Try Again ↺
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
