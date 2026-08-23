import { useState } from "react";
import "./Settings.css";

export default function Settings() {
  const [name, setName] = useState("Morgan Lee");
  const [email, setEmail] = useState("morgan.lee@auditrail.io");
  const [notifications, setNotifications] = useState({
    email: true,
    failedLogins: true,
    weeklyDigest: false,
  });
  const [darkMode, setDarkMode] = useState(true);
  const [saved, setSaved] = useState(false);

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    // TODO: replace with a real API call once backend has a /api/settings route
    console.log("Saving settings:", { name, email, notifications, darkMode });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <h1>Settings</h1>
      <p className="page-subtitle">Manage your profile and preferences.</p>

      <div className="settings-card">
        <h2>Profile</h2>
        <div className="profile-row">
          <div className="profile-avatar">{name.charAt(0)}</div>
          <div className="profile-fields">
            <label>
              Name
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
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

      <div className="settings-save-row">
        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>
        {saved && <span className="save-confirm">✓ Settings saved</span>}
      </div>
    </div>
  );
}
