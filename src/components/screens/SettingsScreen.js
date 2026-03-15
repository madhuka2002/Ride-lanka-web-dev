"use client";

import Sidebar from "../Sidebar";
import { useAuth } from "@/context/AuthContext";

export default function SettingsScreen({ active, showScreen }) {
  const { user } = useAuth();
  const displayName = user?.displayName || user?.email?.split("@")[0] || "traveler";

  return (
    <div id="screen-settings" className={`screen ${active ? "active" : ""}`}>
      <div className="main-layout">
        <Sidebar activeItem="settings" userName={displayName} userRole="Trip planner for Sri Lanka" onNavigate={showScreen} />
        <div className="main-content">
          <div className="topbar"><h1>Settings</h1></div>
          <p style={{ color: "#888", marginTop: 24 }}>Settings will be available soon.</p>
        </div>
      </div>
    </div>
  );
}
