function ProgressBar({ value = 0, max = 100, label = '', color = '#4f46e5', showPercent = true }) {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  return (
    <div className="progress-bar-wrapper">
      {(label || showPercent) && (
        <div className="progress-bar-labels">
          {label && <span className="progress-label">{label}</span>}
          {showPercent && <span className="progress-percent">{percentage}%</span>}
        </div>
      )}
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  );
}

export default ProgressBar;
