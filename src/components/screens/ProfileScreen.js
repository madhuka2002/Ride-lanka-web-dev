"use client";

import Sidebar from "../Sidebar";
import { useAuth } from "@/context/AuthContext";

export default function ProfileScreen({ active, showScreen }) {
  const { user, logOut } = useAuth();
  const displayName = user?.displayName || user?.email?.split("@")[0] || "traveler";

  async function handleLogout() {
    await logOut();
    showScreen("screen-auth");
  }

  return (
    <div id="screen-profile" className={`screen ${active ? "active" : ""}`}>
      <div className="main-layout">
        <Sidebar activeItem="profile" userName={displayName} userRole="Trip planner for Sri Lanka" onNavigate={showScreen} />
        <div className="main-content">
          <div className="topbar"><h1>Profile</h1></div>
          <div style={{ marginTop: 24 }}>
            <p><strong>Name:</strong> {displayName}</p>
            <p><strong>Email:</strong> {user?.email || "-"}</p>
            <button className="btn-teal" style={{ marginTop: 16 }} onClick={handleLogout}>Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  );
}
