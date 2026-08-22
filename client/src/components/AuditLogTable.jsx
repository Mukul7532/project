import { useMemo, useState } from "react";
import "./AuditLogTable.css";

const FILTERS = ["all", "success", "warning", "failed"];

function formatTimestamp(iso) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AuditLogTable({ logs }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredLogs = useMemo(() => {
    if (activeFilter === "all") return logs;
    return logs.filter((log) => log.status === activeFilter);
  }, [logs, activeFilter]);

  return (
    <div className="audit-log-card">
      <div className="audit-log-header">
        <h2>Recent Activity</h2>
        <div className="audit-log-filters">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              className={`filter-chip ${activeFilter === filter ? "active" : ""}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="audit-log-table-wrap">
        <table className="audit-log-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>User</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td className="col-time">{formatTimestamp(log.timestamp)}</td>
                <td>{log.user}</td>
                <td>
                  <span className="action-tag">{log.action}</span>
                </td>
                <td>{log.resource}</td>
                <td>
                  <span className={`status-badge status-${log.status}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={5} className="empty-row">
                  No logs match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}