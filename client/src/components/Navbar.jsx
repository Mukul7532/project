import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-mark">AT</span>
        <span className="logo-text">Audit<b>Trail</b></span>
      </div>
      <ul className="navbar-links">
        <li><a href="/" className="active">Dashboard</a></li>
        <li><a href="/logs">Logs</a></li>
        <li><a href="/reports">Reports</a></li>
        <li><a href="/settings">Settings</a></li>
      </ul>
      <div className="navbar-user">
        <div className="avatar">M</div>
      </div>
    </nav>
  );
}