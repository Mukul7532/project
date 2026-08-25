import StatCard from './StatCard';
import './StatsGrid.css';

export default function StatsGrid({ stats = {} }) {
  return (
    <div className="stats-grid">
      <StatCard 
        label="Total Logs" 
        value={stats.totalLogs || 0}
        trend={stats.logsChange || '+0%'}
        tone="primary"
        icon="📋"
      />
      <StatCard 
        label="Active Users" 
        value={stats.activeUsers || 0}
        trend={stats.usersChange || '+0%'}
        tone="success"
        icon="👥"
      />
      <StatCard 
        label="Errors" 
        value={stats.errors || 0}
        trend={stats.errorsChange || '+0%'}
        tone="error"
        icon="⚠️"
      />
      <StatCard 
        label="Uptime" 
        value={(stats.uptime || 0) + '%'}
        trend={stats.uptimeChange || '+0%'}
        tone="success"
        icon="✓"
      />
    </div>
  );
}