import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
        <div className="logo-mark">⚡</div>
        <span className="logo-text">Audit<b>Trail</b></span>
      </NavLink>

      <ul className="navbar-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/logs" className={({ isActive }) => isActive ? 'active' : ''}>
            Logs
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
            Reports
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
            Settings
          </NavLink>
        </li>
      </ul>

      <div className="navbar-user">
        <div className="avatar">S</div>
      </div>

      <button className="navbar-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? '✕' : '☰'}
      </button>

      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <NavLink to="/" end onClick={() => setMobileMenuOpen(false)}>Dashboard</NavLink>
          <NavLink to="/logs" onClick={() => setMobileMenuOpen(false)}>Logs</NavLink>
          <NavLink to="/reports" onClick={() => setMobileMenuOpen(false)}>Reports</NavLink>
          <NavLink to="/settings" onClick={() => setMobileMenuOpen(false)}>Settings</NavLink>
        </div>
      )}
    </nav>
  );
}