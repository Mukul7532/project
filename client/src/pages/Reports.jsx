import StatsGrid from "../components/StatsGrid";
import { mockStats } from "../data/mockAuditLogs";
import "./Reports.css";

const mockReports = [
  { id: "rep_01", name: "Q3 Security Audit", generated: "Aug 20, 2026", type: "Audit", size: "2.4 MB" },
  { id: "rep_02", name: "Monthly Access Log", generated: "Aug 15, 2026", type: "Access", size: "1.1 MB" },
  { id: "rep_03", name: "Failed Login Summary", generated: "Aug 10, 2026", type: "Security", size: "640 KB" },
  { id: "rep_04", name: "User Permission Changes", generated: "Aug 5, 2026", type: "Access", size: "980 KB" },
  { id: "rep_05", name: "Billing Activity Report", generated: "Jul 30, 2026", type: "Billing", size: "1.6 MB" },
];

export default function Reports() {
  return (
    <div>
      <h1>Reports</h1>
      <p className="page-subtitle">Generated reports and exportable summaries.</p>

      <StatsGrid stats={mockStats} />

      <div className="reports-card">
        <div className="reports-header">
          <h2>Available Reports</h2>
        </div>
        <div className="reports-table-wrap">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Generated</th>
                <th>Size</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {mockReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.name}</td>
                  <td>
                    <span className="report-type-tag">{report.type}</span>
                  </td>
                  <td className="col-muted">{report.generated}</td>
                  <td className="col-muted">{report.size}</td>
                  <td>
                    <button className="download-btn">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}