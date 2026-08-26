import { useMemo, useState } from "react";
import AuditLogTable from "../components/AuditLogTable";
import { mockAuditLogs } from "../data/mockAuditLogs";
import "./Logs.css";

const PAGE_SIZE = 5;

export default function Logs() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

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

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredLogs.slice(start, start + PAGE_SIZE);
  }, [filteredLogs, currentPage]);

  const handleSearchChange = (value) => {
    setQuery(value);
    setPage(1);
  };

  return (
    <div>
      <h1>Logs</h1>
      <p className="page-subtitle">Search and filter the full audit log history.</p>

      <div className="logs-search-wrap">
        <input
          type="text"
          placeholder="Search by user, action, or resource..."
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="logs-search-input"
          aria-label="Search audit logs"
        />
        {query && (
          <button
            className="logs-search-clear"
            onClick={() => handleSearchChange("")}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      <AuditLogTable logs={paginatedLogs} />

      {filteredLogs.length > 0 && (
        <div className="pagination-row">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}