import "./StatCard.css";

export default function StatCard({ label, value, trend, tone = "default" }) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      <span className="stat-card-label">{label}</span>
      <span className="stat-card-value">{value}</span>
      {trend && <span className="stat-card-trend">{trend}</span>}
    </div>
  );
}