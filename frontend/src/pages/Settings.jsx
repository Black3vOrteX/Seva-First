import { useState } from "react";
import {
  Bell,
  MapPin,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);

  return (
    <div className="settings-page">

      <div className="page-heading">
        <div>
          <span className="eyebrow">SYSTEM CONFIGURATION</span>
          <h1>Settings</h1>
          <p>
            Manage your Mausam Intelligence preferences.
          </p>
        </div>
      </div>

      <div className="settings-list">

        <div className="setting-card">
          <div className="setting-icon">
            <Bell size={20} />
          </div>

          <div className="setting-content">
            <h3>Emergency Notifications</h3>
            <p>
              Receive alerts when important weather incidents
              are detected in your area.
            </p>
          </div>

          <button
            className={`toggle ${
              notifications ? "enabled" : ""
            }`}
            onClick={() =>
              setNotifications(!notifications)
            }
          >
            <span></span>
          </button>
        </div>

        <div className="setting-card">
          <div className="setting-icon">
            <MapPin size={20} />
          </div>

          <div className="setting-content">
            <h3>Location Services</h3>
            <p>
              Allow Mausam Intelligence to use your location
              for weather and incident reporting.
            </p>
          </div>

          <button
            className={`toggle ${
              location ? "enabled" : ""
            }`}
            onClick={() => setLocation(!location)}
          >
            <span></span>
          </button>
        </div>

        <div className="setting-card">
          <div className="setting-icon">
            <RefreshCw size={20} />
          </div>

          <div className="setting-content">
            <h3>Live Data Updates</h3>
            <p>
              Dashboard statistics and community reports
              refresh automatically every 30 seconds.
            </p>
          </div>

          <span className="setting-status">
            Active
          </span>
        </div>

        <div className="setting-card">
          <div className="setting-icon">
            <ShieldCheck size={20} />
          </div>

          <div className="setting-content">
            <h3>System Status</h3>
            <p>
              Mausam Intelligence services are connected to
              the backend and database.
            </p>
          </div>

          <span className="setting-status">
            Online
          </span>
        </div>

      </div>

    </div>
  );
}

export default Settings;