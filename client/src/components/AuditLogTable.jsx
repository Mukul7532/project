import { useState } from 'react';
import './AuditLogTable.css';

export default function AuditLogTable({ logs = [] }) {
  const [sortConfig, setSortConfig] = useState({key: 'timestamp', direction: 'desc'});

  if (!logs || logs.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <h3 className="empty-state-title">No Audit Logs</h3>
      </div>
    );
  }

  const getActionBadge = (action) => {
    const map = {'create': 'success', 'update': 'warning', 'delete': 'error', 'view': 'info'};
    return map[action?.toLowerCase()] || 'secondary';
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sortedLogs = [...logs].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    return sortConfig.direction === 'asc'
      ? typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal
      : typeof aVal === 'string' ? bVal.localeCompare(aVal) : bVal - aVal;
  });

  return (
    <div className="table-wrapper">
      <table className="audit-table">
        <thead>
          <tr>
            <th className="sortable" onClick={() => handleSort('timestamp')}>Timestamp ⇅</th>
            <th className="sortable" onClick={() => handleSort('entity')}>Entity ⇅</th>
            <th className="sortable" onClick={() => handleSort('action')}>Action ⇅</th>
            <th className="sortable" onClick={() => handleSort('user')}>User ⇅</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {sortedLogs.map((log, i) => (
            <tr key={i}>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td><strong>{log.entity}</strong></td>
              <td><span className={`badge badge-${getActionBadge(log.action)}`}>{log.action}</span></td>
              <td>{log.user || 'System'}</td>
              <td>{log.details || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
