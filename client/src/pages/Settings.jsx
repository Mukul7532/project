import { useState } from "react";
import "./Settings.css";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    failedLogins: true,
    weeklyDigest: false,
  });
  const [darkMode, setDarkMode] = useState(true);

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <h1>Settings</h1>
      <p className="page-subtitle">Manage your profile and preferences.</p>

      <div className="settings-card">
        <h2>Profile</h2>
        <div className="profile-row">
          <div className="profile-avatar">M</div>
          <div className="profile-fields">
            <label>
              Name
              <input type="text" defaultValue="Morgan Lee" />
            </label>
            <label>
              Email
              <input type="email" defaultValue="morgan.lee@auditrail.io" />
            </label>
          </div>
        </div>
      </div>

      <div className="settings-card">
        <h2>Appearance</h2>
        <div className="settings-row">
          <div>
            <p className="settings-row-title">Dark Mode</p>
            <p className="settings-row-desc">Use the dark theme across the app</p>
          </div>
          <button
            className={`toggle-switch ${darkMode ? "on" : ""}`}
            onClick={() => setDarkMode(!darkMode)}
          >
            <span className="toggle-knob" />
          </button>
        </div>
      </div>

      <div className="settings-card">
        <h2>Notifications</h2>
        {[
          { key: "email", label: "Email notifications", desc: "Get notified about important account activity" },
          { key: "failedLogins", label: "Failed login alerts", desc: "Alert me on suspicious login attempts" },
          { key: "weeklyDigest", label: "Weekly digest", desc: "Summary of activity sent every Monday" },
        ].map((item) => (
          <div className="settings-row" key={item.key}>
            <div>
              <p className="settings-row-title">{item.label}</p>
              <p className="settings-row-desc">{item.desc}</p>
            </div>
            <button
              className={`toggle-switch ${notifications[item.key] ? "on" : ""}`}
              onClick={() => toggleNotification(item.key)}
            >
              <span className="toggle-knob" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}