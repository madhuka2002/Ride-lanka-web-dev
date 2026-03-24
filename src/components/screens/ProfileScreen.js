"use client";

import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, saveUserProfile } from "@/lib/api";

function getLevelDetails(xp) {
  const x = xp || 0;
  if (x < 300) return { level: 1, currentMin: 0, nextMin: 300, color: "#94a3b8" };
  if (x < 500) return { level: 2, currentMin: 300, nextMin: 500, color: "#22c55e" };
  if (x < 700) return { level: 3, currentMin: 500, nextMin: 700, color: "#3b82f6" };
  if (x < 900) return { level: 4, currentMin: 700, nextMin: 900, color: "#8b5cf6" };
  if (x < 1100) return { level: 5, currentMin: 900, nextMin: 1100, color: "#ec4899" };
  if (x < 1300) return { level: 6, currentMin: 1100, nextMin: 1300, color: "#f97316" };
  if (x < 1500) return { level: 7, currentMin: 1300, nextMin: 1500, color: "#ef4444" };
  if (x < 1700) return { level: 8, currentMin: 1500, nextMin: 1700, color: "#eab308" };
  if (x < 1900) return { level: 9, currentMin: 1700, nextMin: 1900, color: "#06b6d4" };
  return { level: 10, currentMin: 1900, nextMin: 1900, color: "#facc15" };
}

export default function ProfileScreen({ active, showScreen }) {
  const { user, token, logOut, updateUserEmail, updateUserPassword } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", bio: "", password: "", profilePic: "" });

  const displayName = profile?.name || user?.displayName || user?.email?.split("@")[0] || "traveler";

  async function handleLogout() {
    await logOut();
    showScreen("screen-auth");
  }

  useEffect(() => {
    if (active && token) {
      getUserProfile(token).then(setProfile).catch(console.error);
    }
  }, [active, token]);

  function handleEditClick() {
    setEditForm({
      name: profile?.name || displayName,
      email: user?.email || "",
      bio: profile?.bio || "",
      password: "",
      profilePic: profile?.profilePic || ""
    });
    setIsEditing(true);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setEditForm(prev => ({ ...prev, profilePic: ev.target.result }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editForm.password) {
        await updateUserPassword(editForm.password);
      }
      if (editForm.email !== user.email) {
        await updateUserEmail(editForm.email);
      }
      await saveUserProfile(token, {
        name: editForm.name,
        email: editForm.email,
        bio: editForm.bio,
        profilePic: editForm.profilePic
      });
      // reload profile
      const updated = await getUserProfile(token);
      setProfile(updated);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div id="screen-profile" className={`screen ${active ? "active" : ""}`}>
      <div className="main-layout">
        <Sidebar activeItem="profile" userName={displayName} userRole="Trip planner for Sri Lanka" onNavigate={showScreen} />
        <div className="main-content">
          <div className="topbar">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <h1>Profile</h1>
              {!isEditing && (
                <button className="btn-primary" onClick={handleEditClick} style={{ padding: "8px 16px", fontSize: "0.95rem", background: "var(--teal)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                  ✎ Edit Profile
                </button>
              )}
            </div>
          </div>
          
          <div style={{ marginTop: 24 }}>
            {!isEditing && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: "24px", marginBottom: 32 }}>
                {profile?.profilePic ? (
                  <img src={profile.profilePic} style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--gray-200)" }} alt="Profile Avatar" />
                ) : (
                  <div style={{ width: 100, height: 100, borderRadius: "50%", background: "var(--teal-light)", color: "var(--teal-dark)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", fontWeight: "bold" }}>
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 style={{ margin: "0 0 8px 0", fontSize: "1.8rem", color: "var(--text-main)" }}>{displayName}</h2>
                  <p style={{ margin: "0 0 12px 0", color: "var(--gray-600)", fontSize: "1rem" }}>{user?.email || "-"}</p>
                  {profile?.bio && <p style={{ margin: "0", color: "var(--text-light)", fontStyle: "italic", lineHeight: "1.5" }}>"{profile.bio}"</p>}
                </div>
              </div>
            )}

            {isEditing && (
              <form onSubmit={handleSave} style={{ marginBottom: 32, padding: 24, background: "white", borderRadius: 12, boxShadow: "var(--shadow-sm)" }}>
                <h2 style={{ fontSize: "1.2rem", marginBottom: "20px" }}>Edit Profile</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: "500" }}>Profile Picture (PNG/JPG)</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      {editForm.profilePic && <img src={editForm.profilePic} style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }} alt="Avatar Preview" />}
                      <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: "500" }}>Name</label>
                    <input type="text" className="input-field" value={editForm.name} onChange={e => setEditForm(prev => ({...prev, name: e.target.value}))} required />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: "500" }}>Email <small style={{ fontWeight: "normal", color: "var(--gray-500)" }}>(Requires recent login to change)</small></label>
                    <input type="email" className="input-field" value={editForm.email} onChange={e => setEditForm(prev => ({...prev, email: e.target.value}))} required disabled={user?.isDevAdmin} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: "500" }}>Bio</label>
                    <textarea className="input-field" rows={3} value={editForm.bio} onChange={e => setEditForm(prev => ({...prev, bio: e.target.value}))} placeholder="Tell us about yourself..." />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: "500" }}>New Password <small style={{ fontWeight: "normal", color: "var(--gray-500)" }}>(Leave blank to keep current)</small></label>
                    <input type="password" className="input-field" value={editForm.password} onChange={e => setEditForm(prev => ({...prev, password: e.target.value}))} placeholder="••••••••" disabled={user?.isDevAdmin} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: 24 }}>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button type="button" className="btn-outline" onClick={() => setIsEditing(false)} disabled={saving}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {!isEditing && profile && (
              <div style={{ 
                marginTop: 24, 
                padding: "24px", 
                background: "white", 
                borderRadius: 12, 
                boxShadow: "var(--shadow-sm)",
                border: `3px solid ${getLevelDetails(profile.xp).color}`
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h2 style={{ fontSize: "1.4rem", margin: 0, color: getLevelDetails(profile.xp).color, display: "flex", alignItems: "center", gap: "8px" }}>
                    Level {getLevelDetails(profile.xp).level} Traveler
                  </h2>
                  <div style={{ background: "var(--teal-light)", color: "var(--teal-dark)", padding: "6px 16px", borderRadius: 20, fontWeight: "bold", fontSize: "1.1rem" }}>
                    {profile.xp || 0} XP
                  </div>
                </div>

                {getLevelDetails(profile.xp).level < 10 && (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--gray-600)", marginBottom: 6 }}>
                      <span>Progress to Level {getLevelDetails(profile.xp).level + 1}</span>
                      <span>{profile.xp || 0} / {getLevelDetails(profile.xp).nextMin} XP</span>
                    </div>
                    <div style={{ width: "100%", height: "10px", background: "var(--gray-100)", borderRadius: "10px", overflow: "hidden" }}>
                      <div style={{ 
                        height: "100%", 
                        background: getLevelDetails(profile.xp).color, 
                        width: `${Math.min(100, Math.max(0, ((profile.xp || 0) - getLevelDetails(profile.xp).currentMin) / ((getLevelDetails(profile.xp).nextMin - getLevelDetails(profile.xp).currentMin) || 1) * 100))}%`,
                        transition: "width 0.5s ease"
                      }} />
                    </div>
                  </div>
                )}
                
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--gray-100)" }}>
                  <h3 style={{ fontSize: "1rem", color: "var(--gray-600)", marginBottom: 12 }}>Earned Badges</h3>
                  {(!profile.badges || profile.badges.length === 0) ? (
                    <p style={{ color: "var(--gray-400)", fontSize: "0.95rem" }}>No badges earned yet. Complete quests to collect them!</p>
                  ) : (
                    <div className="honeycomb">
                      {profile.badges.map(b => (
                        <div key={b.id} className="hexagon" title={b.name} style={{ border: `1px solid ${getLevelDetails(profile.xp).color}33` }}>
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

            <button className="btn-logout-small" onClick={handleLogout}>Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  );
}
