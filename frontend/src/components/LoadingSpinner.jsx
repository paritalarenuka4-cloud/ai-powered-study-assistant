function LoadingSpinner({ message = 'Loading content...', size = 'md' }) {
  return (
    <div className={`loading-container loading-${size}`}>
      <div className="spinner-ring"></div>
      <p className="loading-text">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
