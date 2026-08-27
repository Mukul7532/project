import { useEffect, useState } from "react";
import StatsGrid from "./components/StatsGrid";
import ActivityChart from "./components/ActivityChart";
import AuditLogTable from "./components/AuditLogTable";
import { SkeletonStatsGrid, SkeletonChart, SkeletonTable } from "./components/Skeleton";
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

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="page-subtitle">Welcome back. Here's your audit trail overview.</p>

      {!loading && notice && <div className="data-notice">{notice}</div>}

      {loading ? (
        <>
          <SkeletonStatsGrid />
          <SkeletonChart />
          <SkeletonTable />
        </>
      ) : (
        <>
          <StatsGrid stats={stats} />
          <ActivityChart />
          <AuditLogTable logs={logs} />
        </>
      )}
    </div>
  );
}