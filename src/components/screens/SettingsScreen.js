"use client";

import { useState } from "react";
import Sidebar from "../Sidebar";

export default function SettingsScreen({ active, showScreen }) {
  const [reminders, setReminders] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [community, setCommunity] = useState(false);
  const [promo, setPromo] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);
  const [shareLocation, setShareLocation] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <div id="screen-settings" className={`screen ${active ? "active" : ""}`}>
      <div className="main-layout">
        <Sidebar activeItem="settings" logoIcon="🌍" logoText="Dream" logoEm="Trip" userName="Sithil Semitha" userRole="Explorer · Pro" onNavigate={showScreen} />
        <div className="main-content">
          <div className="topbar"><div><h1>Settings ⚙️</h1><div className="subtitle">Manage your preferences</div></div></div>
          <div className="settings-layout">
            <div className="settings-nav">
              <div className="settings-nav-item active">👤 Account</div>
              <div className="settings-nav-item">🔔 Notifications</div>
              <div className="settings-nav-item">🔒 Privacy</div>
              <div className="settings-nav-item">🌐 Language</div>
              <div className="settings-nav-item">💳 Payments</div>
              <div className="settings-nav-item">📱 App Preferences</div>
              <div className="settings-nav-item" style={{ color: "#ef4444", marginTop: 20 }}>🚪 Sign Out</div>
            </div>
            <div className="settings-content">
              <div className="settings-section">
                <h4>Notifications</h4>
                <div className="settings-row">
                  <div className="label"><h5>Trip Reminders</h5><p>Get notified about upcoming trips</p></div>
                  <div className={`toggle ${reminders ? "on" : ""}`} onClick={() => setReminders(!reminders)} role="button" tabIndex={0} />
                </div>
                <div className="settings-row">
                  <div className="label"><h5>Price Alerts</h5><p>Notify when saved destinations drop in price</p></div>
                  <div className={`toggle ${priceAlerts ? "on" : ""}`} onClick={() => setPriceAlerts(!priceAlerts)} role="button" tabIndex={0} />
                </div>
                <div className="settings-row">
                  <div className="label"><h5>Community Activity</h5><p>Likes, comments, and new followers</p></div>
                  <div className={`toggle ${community ? "on" : ""}`} onClick={() => setCommunity(!community)} role="button" tabIndex={0} />
                </div>
                <div className="settings-row">
                  <div className="label"><h5>Promotional Emails</h5><p>Deals and travel inspiration emails</p></div>
                  <div className={`toggle ${promo ? "on" : ""}`} onClick={() => setPromo(!promo)} role="button" tabIndex={0} />
                </div>
              </div>
              <div className="settings-section">
                <h4>Privacy & Security</h4>
                <div className="settings-row">
                  <div className="label"><h5>Public Profile</h5><p>Let others find and follow your travel profile</p></div>
                  <div className={`toggle ${publicProfile ? "on" : ""}`} onClick={() => setPublicProfile(!publicProfile)} role="button" tabIndex={0} />
                </div>
                <div className="settings-row">
                  <div className="label"><h5>Share Location</h5><p>Share your current location with followers</p></div>
                  <div className={`toggle ${shareLocation ? "on" : ""}`} onClick={() => setShareLocation(!shareLocation)} role="button" tabIndex={0} />
                </div>
                <div className="settings-row">
                  <div className="label"><h5>Two-Factor Authentication</h5><p>Add extra security to your account</p></div>
                  <div className={`toggle ${twoFactor ? "on" : ""}`} onClick={() => setTwoFactor(!twoFactor)} role="button" tabIndex={0} />
                </div>
              </div>
              <div className="settings-section">
                <h4>App Preferences</h4>
                <div className="settings-row">
                  <div className="label"><h5>Currency</h5><p>Display prices in your preferred currency</p></div>
                  <select style={{ padding: "8px 12px", border: "1.5px solid var(--gray-200)", borderRadius: 8, fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
                    <option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option>
                  </select>
                </div>
                <div className="settings-row">
                  <div className="label"><h5>Language</h5><p>Interface display language</p></div>
                  <select style={{ padding: "8px 12px", border: "1.5px solid var(--gray-200)", borderRadius: 8, fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
                    <option>English</option><option>French</option><option>Spanish</option>
                  </select>
                </div>
                <div className="settings-row">
                  <div className="label"><h5>Distance Unit</h5><p>Kilometers or miles</p></div>
                  <select style={{ padding: "8px 12px", border: "1.5px solid var(--gray-200)", borderRadius: 8, fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
                    <option>Kilometers</option><option>Miles</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
