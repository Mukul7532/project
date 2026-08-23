import { useEffect, useState } from "react";
import StatsGrid from "./components/StatsGrid";
import ActivityChart from "./components/ActivityChart";
import AuditLogTable from "./components/AuditLogTable";
import { fetchAuditLogs, fetchStats } from "./api";

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [logsResult, statsResult] = await Promise.all([fetchAuditLogs(), fetchStats()]);
      setLogs(logsResult.data);
      setStats(statsResult.data);
      setNotice(logsResult.error || statsResult.error);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div>
        <h1>Dashboard</h1>
        <p className="page-subtitle">Loading your audit trail overview...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="page-subtitle">Welcome back. Here's your audit trail overview.</p>

      {notice && <div className="data-notice">{notice}</div>}

      <StatsGrid stats={stats} />
      <ActivityChart />
      <AuditLogTable logs={logs} />
    </div>
  );
}

