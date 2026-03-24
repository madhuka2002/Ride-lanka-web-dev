import Sidebar from "../Sidebar";
import { useSettings } from "@/context/SettingsContext";

export default function SettingsScreen({ active, showScreen }) {
  const { 
    theme, setTheme, 
    language, setLanguage, 
    notifications, setNotifications,
    privacy, setPrivacy 
  } = useSettings();

  const toggleNotif = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePrivacy = (key) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div id="screen-settings" className={`screen ${active ? "active" : ""}`}>
      <div className="main-layout">
        <Sidebar 
          activeItem="settings" 
          userName="Sithil Semitha" 
          userRole="Trip planner for Sri Lanka" 
          onNavigate={showScreen} 
        />
        <div className="main-content">
        <div className="topbar">
          <h1>Settings</h1>
          <p className="topbar-subtitle">Manage your account preferences and application experience.</p>
        </div>

        <div className="settings-grid">
          {/* Appearance Section */}
          <div className="settings-card">
            <div className="card-header">
              <span className="icon">🎨</span>
              <div>
                <h3>Appearance</h3>
                <p>Customize how Ride-Lanka looks on your device.</p>
              </div>
            </div>
            <div className="card-body">
              <div className="theme-selector">
                <button 
                  className={`theme-btn ${theme === "light" ? "active" : ""}`}
                  onClick={() => setTheme("light")}
                >
                  <span className="icon">☀️</span> Light
                </button>
                <button 
                  className={`theme-btn ${theme === "dark" ? "active" : ""}`}
                  onClick={() => setTheme("dark")}
                >
                  <span className="icon">🌙</span> Dark
                </button>
                <button 
                  className={`theme-btn ${theme === "system" ? "active" : ""}`}
                  onClick={() => setTheme("system")}
                >
                  <span className="icon">💻</span> System
                </button>
              </div>
            </div>
          </div>

          {/* Language Section */}
          <div className="settings-card">
            <div className="card-header">
              <span className="icon">🌐</span>
              <div>
                <h3>Language</h3>
                <p>Select your preferred language for the interface.</p>
              </div>
            </div>
            <div className="card-body">
              <select 
                className="input-field" 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English (US)</option>
                <option value="si">Sinhala (සිංහල)</option>
                <option value="ta">Tamil (தமிழ்)</option>
              </select>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="settings-card">
            <div className="card-header">
              <span className="icon">🔔</span>
              <div>
                <h3>Notifications</h3>
                <p>Control which alerts you want to receive.</p>
              </div>
            </div>
            <div className="card-body">
              <div className="setting-item">
                <div className="label-group">
                  <span className="item-title">Email Notifications</span>
                  <p className="item-desc">Receive trip summaries and recommendations via email.</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={notifications.email} onChange={() => toggleNotif("email")} />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="label-group">
                  <span className="item-title">Push Notifications</span>
                  <p className="item-desc">Get real-time alerts for travel updates and badges.</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={notifications.push} onChange={() => toggleNotif("push")} />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="settings-card">
            <div className="card-header">
              <span className="icon">🔒</span>
              <div>
                <h3>Security & Privacy</h3>
                <p>Manage your account visibility and data tracking.</p>
              </div>
            </div>
            <div className="card-body">
              <div className="setting-item">
                <div className="label-group">
                  <span className="item-title">Public Profile</span>
                  <p className="item-desc">Allow others to see your traveler level and badges.</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={privacy.publicProfile} onChange={() => togglePrivacy("publicProfile")} />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="label-group">
                  <span className="item-title">Activity Tracking</span>
                  <p className="item-desc">Use your travel behavior to improve AI recommendations.</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={privacy.tracking} onChange={() => togglePrivacy("tracking")} />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
