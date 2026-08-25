import { useState, useEffect } from 'react';
import AuditLogTable from '../components/AuditLogTable';
import { fetchAuditLogs } from '../api';
import './Logs.css';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const result = await fetchAuditLogs();
        setLogs(result.data || []);
        setFilteredLogs(result.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    let filtered = logs;
    if (searchTerm) filtered = filtered.filter(log =>
      log.entity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (actionFilter !== 'all') filtered = filtered.filter(log => log.action?.toLowerCase() === actionFilter.toLowerCase());
    setFilteredLogs(filtered);
  }, [searchTerm, actionFilter, logs]);

  if (loading) return <div className="skeleton" style={{height: '400px'}}></div>;

  return (
    <div>
      <h1>Audit Logs</h1>
      <p className="page-subtitle">Complete audit trail of all system activities.</p>

      <div className="logs-filters">
        <input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />
        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="filter-select">
          <option value="all">All Actions</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
          <option value="view">View</option>
        </select>
      </div>

      <div className="logs-info">Showing <strong>{filteredLogs.length}</strong> of <strong>{logs.length}</strong> logs</div>
      <AuditLogTable logs={filteredLogs} />
    </div>
  );
}