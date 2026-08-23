import { useMemo, useState } from "react";
import AuditLogTable from "../components/AuditLogTable";
import { mockAuditLogs } from "../data/mockAuditLogs";
import "./Logs.css";

export default function Logs() {
  const [query, setQuery] = useState("");

  const filteredLogs = useMemo(() => {
    if (!query.trim()) return mockAuditLogs;
    const lower = query.toLowerCase();
    return mockAuditLogs.filter(
      (log) =>
        log.user.toLowerCase().includes(lower) ||
        log.action.toLowerCase().includes(lower) ||
        log.resource.toLowerCase().includes(lower)
    );
  }, [query]);

  return (
    <div>
      <h1>Logs</h1>
      <p className="page-subtitle">Search and filter the full audit log history.</p>

      <div className="logs-search-wrap">
        <input
          type="text"
          placeholder="Search by user, action, or resource..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="logs-search-input"
        />
        {query && (
          <button className="logs-search-clear" onClick={() => setQuery("")}>
            ×
          </button>
        )}
      </div>

      <AuditLogTable logs={filteredLogs} />
    </div>
  );
}