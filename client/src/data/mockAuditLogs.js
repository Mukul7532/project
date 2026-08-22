// Sample audit log data for Dashboard development.
// Replace with a real API call (e.g. axios.get('/api/logs')) once the backend route exists.

export const mockAuditLogs = [
  {
    id: "log_1001",
    timestamp: "2026-08-22T14:32:10Z",
    user: "morgan.lee@auditrail.io",
    action: "UPDATE",
    resource: "User Permissions",
    status: "success",
  },
  {
    id: "log_1002",
    timestamp: "2026-08-22T14:18:47Z",
    user: "system",
    action: "LOGIN",
    resource: "Auth Service",
    status: "success",
  },
  {
    id: "log_1003",
    timestamp: "2026-08-22T13:55:02Z",
    user: "priya.nair@auditrail.io",
    action: "DELETE",
    resource: "Invoice #4471",
    status: "failed",
  },
  {
    id: "log_1004",
    timestamp: "2026-08-22T13:41:19Z",
    user: "diego.marquez@auditrail.io",
    action: "CREATE",
    resource: "New Report",
    status: "success",
  },
  {
    id: "log_1005",
    timestamp: "2026-08-22T12:59:33Z",
    user: "unknown",
    action: "LOGIN",
    resource: "Auth Service",
    status: "warning",
  },
  {
    id: "log_1006",
    timestamp: "2026-08-22T12:20:08Z",
    user: "morgan.lee@auditrail.io",
    action: "UPDATE",
    resource: "Billing Settings",
    status: "success",
  },
  {
    id: "log_1007",
    timestamp: "2026-08-22T11:47:52Z",
    user: "priya.nair@auditrail.io",
    action: "EXPORT",
    resource: "Q3 Audit Log",
    status: "success",
  },
  {
    id: "log_1008",
    timestamp: "2026-08-22T11:02:15Z",
    user: "diego.marquez@auditrail.io",
    action: "DELETE",
    resource: "User Account #882",
    status: "warning",
  },
];

export const mockStats = {
  totalLogs: 12847,
  activeUsers: 314,
  actionsToday: 96,
  failedActions: 7,
};