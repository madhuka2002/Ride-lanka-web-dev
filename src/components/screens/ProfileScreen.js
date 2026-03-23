"use client";

import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile } from "@/lib/api";

export default function ProfileScreen({ active, showScreen }) {
  const { user, token, logOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const displayName = user?.displayName || user?.email?.split("@")[0] || "traveler";

  async function handleLogout() {
    await logOut();
    showScreen("screen-auth");
  }

  useEffect(() => {
    if (active && token) {
      getUserProfile(token).then(setProfile).catch(console.error);
    }
  }, [active, token]);

  return (
    <div id="screen-profile" className={`screen ${active ? "active" : ""}`}>
      <div className="main-layout">
        <Sidebar activeItem="profile" userName={displayName} userRole="Trip planner for Sri Lanka" onNavigate={showScreen} />
        <div className="main-content">
          <div className="topbar"><h1>Profile</h1></div>
          <div style={{ marginTop: 24 }}>
            <p><strong>Name:</strong> {displayName}</p>
            <p><strong>Email:</strong> {user?.email || "-"}</p>

            {profile && (
              <div style={{ marginTop: 24, padding: "16px 24px", background: "white", borderRadius: 12, boxShadow: "var(--shadow-sm)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--gray-100)", paddingBottom: 16 }}>
                  <h2 style={{ fontSize: "1.2rem", margin: 0 }}>Traveler Status</h2>
                  <div style={{ background: "var(--teal-light)", color: "var(--teal-dark)", padding: "6px 16px", borderRadius: 20, fontWeight: "bold", fontSize: "1.1rem" }}>
                    {profile.xp || 0} XP
                  </div>
                </div>
                
                <div style={{ marginTop: 20 }}>
                  <h3 style={{ fontSize: "1rem", color: "var(--gray-600)", marginBottom: 12 }}>Earned Badges</h3>
                  {(!profile.badges || profile.badges.length === 0) ? (
                    <p style={{ color: "var(--gray-400)", fontSize: "0.95rem" }}>No badges earned yet. Complete quests to collect them!</p>
                  ) : (
                    <div className="honeycomb">
                      {profile.badges.map(b => (
                        <div key={b.id} className="hexagon" title={b.name}>
                          {b.url && <img src={b.url} alt={b.name} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{ marginTop: 32, padding: 24, background: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--border-color)" }}>
              <h2 style={{ fontSize: "1.2rem", marginBottom: 8 }}>Traveler Quests</h2>
              <p style={{ color: "var(--text-light)", marginBottom: 16 }}>
                View and complete available quests to earn rewards!
              </p>
              <button className="btn-primary" onClick={() => showScreen("screen-quests")}>
                View Quests
              </button>
            </div>

            <button className="btn-teal" style={{ marginTop: 32 }} onClick={handleLogout}>Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  );
}
