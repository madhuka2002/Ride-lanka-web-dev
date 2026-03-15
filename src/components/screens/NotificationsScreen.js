"use client";

import Sidebar from "../Sidebar";
import { useAuth } from "@/context/AuthContext";

export default function NotificationsScreen({ active, showScreen }) {
  const { user } = useAuth();
  const displayName = user?.displayName || user?.email?.split("@")[0] || "traveler";

  return (
    <div id="screen-notif" className={`screen ${active ? "active" : ""}`}>
      <div className="main-layout">
        <Sidebar activeItem="notif" userName={displayName} userRole="Trip planner for Sri Lanka" onNavigate={showScreen} />
        <div className="main-content">
          <div className="topbar"><h1>Notifications</h1></div>
          <p style={{ color: "#888", marginTop: 24 }}>No new notifications.</p>
        </div>
      </div>
    </div>
  );
}
