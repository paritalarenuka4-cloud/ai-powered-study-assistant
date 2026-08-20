function Card({ children, title, subtitle, icon, action, className = '', hoverable = false }) {
  return (
    <div className={`app-card ${hoverable ? 'app-card-hover' : ''} ${className}`}>
      {(title || subtitle || icon || action) && (
        <div className="app-card-header">
          <div className="card-header-left">
            {icon && <span className="card-icon">{icon}</span>}
            <div>
              {title && <h3 className="card-title">{title}</h3>}
              {subtitle && <p className="card-subtitle">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="card-header-action">{action}</div>}
        </div>
      )}
      <div className="app-card-body">{children}</div>
    </div>
  );
}

export default Card;
