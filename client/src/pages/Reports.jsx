import { useState, useEffect } from 'react';
import StatsGrid from '../components/StatsGrid';
import ActivityChart from '../components/ActivityChart';
import './Reports.css';

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [dateRange, setDateRange] = useState('30days');

  useEffect(() => {
    setStats({
      totalLogs: 12543,
      logsChange: '+12%',
      activeUsers: 1024,
      usersChange: '+8%',
      errors: 24,
      errorsChange: '-5%',
      uptime: 99.2,
      uptimeChange: '+0.1%'
    });
  }, [dateRange]);

  return (
    <div>
      <h1>Reports</h1>
      <p className="page-subtitle">Comprehensive audit trail analytics.</p>

      <div className="reports-filter">
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="filter-select">
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      {stats && (
        <>
          <StatsGrid stats={stats} />
          <div className="page-section">
            <ActivityChart />
          </div>
          <div className="page-section">
            <h2>Export Report</h2>
            <div className="export-buttons">
              <button className="btn btn-primary">📥 Export PDF</button>
              <button className="btn btn-secondary">📊 Export CSV</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}