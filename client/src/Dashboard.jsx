import StatsGrid from "./components/StatsGrid";
import ActivityChart from "./components/ActivityChart";
import AuditLogTable from "./components/AuditLogTable";
import { mockAuditLogs, mockStats } from "./data/mockAuditLogs";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p className="page-subtitle">Welcome back. Here's your audit trail overview.</p>

      <StatsGrid stats={mockStats} />
      <ActivityChart />
      <AuditLogTable logs={mockAuditLogs} />
    </div>
  );
}
