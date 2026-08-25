import { useState } from 'react';
import './Settings.css';

export default function Settings() {
  const [settings, setSettings] = useState({
    appName: 'Audit Trail',
    timezone: 'UTC',
    retention: '365',
    notifications: true
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <h1>Settings</h1>
      <p className="page-subtitle">Configure application settings.</p>

      {saved && <div className="data-notice data-success">✓ Settings saved successfully!</div>}

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-section">
          <h2>Application Settings</h2>
          
          <div className="form-group">
            <label>Application Name</label>
            <input
              type="text"
              name="appName"
              value={settings.appName}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Timezone</label>
            <select name="timezone" value={settings.timezone} onChange={handleChange} className="form-select">
              <option value="UTC">UTC</option>
              <option value="EST">EST</option>
              <option value="PST">PST</option>
              <option value="IST">IST</option>
            </select>
          </div>

          <div className="form-group">
            <label>Logs Retention (days)</label>
            <input
              type="number"
              name="retention"
              value={settings.retention}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
              />
              Enable Email Notifications
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">💾 Save Settings</button>
      </form>
    </div>
  );
}
