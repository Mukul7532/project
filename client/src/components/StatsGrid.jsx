import StatCard from "./StatCard";
import "./StatsGrid.css";

export default function StatsGrid({ stats }) {
  return (
    <div className="stats-grid">
      <StatCard label="Total Logs" value={stats.totalLogs.toLocaleString()} />
      <StatCard label="Active Users" value={stats.activeUsers.toLocaleString()} />
      <StatCard label="Actions Today" value={stats.actionsToday.toLocaleString()} />
      <StatCard
        label="Failed Actions"
        value={stats.failedActions.toLocaleString()}
        tone="warning"
      />
    </div>
  );
}