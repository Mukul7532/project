import StatsGrid from "./components/StatsGrid";
import AuditLogTable from "./components/AuditLogTable";
import { mockAuditLogs, mockStats } from "./data/mockAuditLogs";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p className="page-subtitle">Welcome back. Here's your audit trail overview.</p>

      <StatsGrid stats={mockStats} />
      <AuditLogTable logs={mockAuditLogs} />
    </div>
  );
}