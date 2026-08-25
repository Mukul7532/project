import { useEffect, useState } from 'react';
import StatsGrid from './components/StatsGrid';
import ActivityChart from './components/ActivityChart';
import AuditLogTable from './components/AuditLogTable';
import { fetchAuditLogs, fetchStats } from './api';

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [logsResult, statsResult] = await Promise.all([fetchAuditLogs(), fetchStats()]);
        setLogs(logsResult.data || []);
        setStats(statsResult.data);
        if (logsResult.error || statsResult.error) setError(logsResult.error || statsResult.error);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="page-container loading">
        <div className="skeleton-loader">
          <div className="skeleton lg"></div>
          <div className="skeleton sm" style={{ width: '60%' }}></div>
          <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '100px' }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="page-subtitle">Welcome back. Here's your audit trail overview.</p>

      {error && <div className="data-notice data-error">{error}</div>}

      {!error && stats && (
        <>
          <StatsGrid stats={stats} />
          <div className="page-section">
            <h2>Activity Overview</h2>
            <ActivityChart />
          </div>
          <div className="page-section">
            <h2>Recent Activity</h2>
            <AuditLogTable logs={logs} />
          </div>
        </>
      )}

      {!loading && !stats && !error && (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3 className="empty-state-title">No Data Available</h3>
        </div>
      )}
    </div>
  );
}