function StatCard({ number, label, description, type }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${type}`}>
        {type === "reports" && "📋"}
        {type === "active" && "🚨"}
        {type === "critical" && "⚠️"}
      </div>

      <div className="stat-number">
        {number}
      </div>

      <div className="stat-label">
        {label}
      </div>

      <div className="stat-description">
        {description}
      </div>
    </div>
  );
}

export default StatCard;