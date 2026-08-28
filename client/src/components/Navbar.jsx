import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-logo">
        <span className="logo-mark">AT</span>
        <span className="logo-text">Audit<b>Trail</b></span>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/logs" className={({ isActive }) => (isActive ? "active" : "")}>
            Logs
          </NavLink>
        </li>
        <li>
  <NavLink to="/timeline" className={({ isActive }) => (isActive ? "active" : "")}>
    Timeline
  </NavLink>
</li>
        <li>
          <NavLink to="/reports" className={({ isActive }) => (isActive ? "active" : "")}>
            Reports
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>
            Settings
          </NavLink>
        </li>
      </ul>
      <div className="navbar-user">
        <div className="avatar" role="button" tabIndex={0} aria-label="User menu">M</div>
      </div>
    </nav>
  );
}