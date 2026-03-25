"use client";

import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useGuideAuth } from "@/context/GuideAuthContext";
import { getUserProfile, saveUserProfile } from "@/lib/api";
import { saveMyGuideProfile } from "@/lib/tourGuides";
import { useSettings } from "@/context/SettingsContext";
import { useAppMode } from "@/context/AppModeContext";

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
  const { user: travelerUser, token, logOut: travelerLogout, updateUserEmail, updateUserPassword } = useAuth();
  const { guide: guideUser, guideLogOut } = useGuideAuth();
  const { isGuideMode } = useAppMode();
  const { t } = useSettings();

  const user = isGuideMode ? guideUser : travelerUser;
  
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ 
    firstName: "", 
    lastName: "", 
    email: "", 
    dob: "", 
    phoneNumber: "", 
    bio: "", 
    password: "", 
    confirmPassword: "",
    profilePic: "" 
  });

  const displayName = isGuideMode 
    ? (guideUser?.displayName || guideUser?.email?.split("@")[0] || "Guide")
    : (profile?.name || travelerUser?.displayName || travelerUser?.email?.split("@")[0] || "traveler");

  async function handleLogout() {
    if (isGuideMode) {
      await guideLogOut();
    } else {
      await travelerLogout();
    }
    showScreen("screen-splash");
  }

  useEffect(() => {
    if (active && !isGuideMode && token) {
      getUserProfile(token).then(setProfile).catch(console.error);
    }
  }, [active, token, isGuideMode]);

  function handleEditClick() {
    setEditForm({
      firstName: isGuideMode ? (guideUser?.displayName?.split(" ")[0] || "") : (profile?.firstName || profile?.name?.split(" ")[0] || ""),
      lastName: isGuideMode ? (guideUser?.displayName?.split(" ").slice(1).join(" ") || "") : (profile?.lastName || profile?.name?.split(" ").slice(1).join(" ") || ""),
      email: user?.email || "",
      dob: profile?.dob || "",
      phoneNumber: profile?.phoneNumber || "",
      bio: isGuideMode ? (guideUser?.bio || "") : (profile?.bio || ""),
      password: "",
      confirmPassword: "",
      profilePic: isGuideMode ? (guideUser?.photoURL || "") : (profile?.profilePic || "")
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
    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      alert("Passwords do not match!");
      setSaving(false);
      return;
    }

    try {
      if (isGuideMode) {
        // Update guide profile in 'dyourguides'
        await saveMyGuideProfile(guideUser, {
          displayName: `${editForm.firstName} ${editForm.lastName}`.trim(),
          email: editForm.email,
          password: editForm.password || guideUser.password,
          bio: editForm.bio,
          photoURL: editForm.profilePic
        });
        alert("Account updated successfully! Please log in again if you changed your email or password.");
      } else {
        if (editForm.password) {
          await updateUserPassword(editForm.password);
        }
        if (editForm.email !== travelerUser.email) {
          await updateUserEmail(editForm.email);
        }
        await saveUserProfile(token, {
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          name: `${editForm.firstName} ${editForm.lastName}`.trim(),
          email: editForm.email,
          dob: editForm.dob,
          phoneNumber: editForm.phoneNumber,
          bio: editForm.bio,
          profilePic: editForm.profilePic
        });
        const updated = await getUserProfile(token);
        setProfile(updated);
      }
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
        <Sidebar activeItem="profile" userName={displayName} userRole={isGuideMode ? t("appRoleTourGuide") : t("appRoleTripPlanner")} onNavigate={showScreen} />
        <div className="main-content">
          <div className="topbar">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <h1>{t("Profile")}</h1>
              {!isEditing && (
                <button className="btn-primary" onClick={handleEditClick} style={{ padding: "8px 16px", fontSize: "0.95rem", background: "var(--teal)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                  ✎ {t("profileEdit")}
                </button>
              )}
            </div>
          </div>
          
          <div style={{ marginTop: 32 }}>
            {!isEditing && (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 32, 
                marginBottom: 48,
                padding: "24px 32px",
                background: "var(--gray-50)",
                borderRadius: 24,
                border: "1px solid var(--gray-100)",
                boxShadow: "var(--shadow-sm)"
              }}>
                <div style={{ position: "relative" }}>
                  {(isGuideMode ? user?.photoURL : profile?.profilePic) ? (
                    <img src={isGuideMode ? user.photoURL : profile.profilePic} style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: "4px solid var(--gray-100)", boxShadow: "var(--shadow)" }} alt="Profile Avatar" />
                  ) : (
                    <div style={{ width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg, var(--teal), #0891b2)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", fontWeight: 800, textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div style={{ position: "absolute", bottom: 8, right: 8, width: 24, height: 24, background: "#22c55e", borderRadius: "50%", border: "4px solid #0f172a" }} title="Online"></div>
                </div>
                <div>
                  <h2 style={{ margin: "0 0 6px 0", fontSize: "2.4rem", fontWeight: 800, letterSpacing: -1, color: "var(--text)" }}>{displayName}</h2>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ 
                      padding: "4px 12px", 
                      borderRadius: 100, 
                      background: "var(--teal-light)", 
                      color: "var(--teal-dark)", 
                      fontSize: 13, 
                      fontWeight: 600,
                      border: "1px solid var(--teal-mid)"
                    }}>
                      {user?.email || "-"}
                    </span>
                  </div>
                  {(isGuideMode ? user?.bio : profile?.bio) && (
                    <p style={{ margin: 0, color: "var(--gray-400)", fontSize: 16, lineHeight: 1.5, maxWidth: 600 }}>
                      {(isGuideMode ? user?.bio : profile?.bio)}
                    </p>
                  )}
                </div>
              </div>
            )}
            {isEditing && (
              <form onSubmit={handleSave} className="profile-edit-card">
                <div className="edit-card-header">
                  <h2>{t("editProfileTitle")}</h2>
                  <p>{t("editProfileSubtitle")}</p>
                </div>

                <div className="profile-pic-edit">
                  <div className="preview-container">
                    {editForm.profilePic ? (
                      <img src={editForm.profilePic} className="preview-img" alt="Avatar Preview" />
                    ) : (
                      <div className="preview-placeholder">
                        {(editForm.firstName.charAt(0) || "U").toUpperCase()}
                      </div>
                    )}
                    <label className="upload-overlay">
                      <span>Change</span>
                      <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} hidden />
                    </label>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>{t("firstNameLabel")}</label>
                    <input type="text" className="input-field" value={editForm.firstName} onChange={e => setEditForm(prev => ({...prev, firstName: e.target.value}))} required />
                  </div>
                  <div className="form-group">
                    <label>{t("lastNameLabel")}</label>
                    <input type="text" className="input-field" value={editForm.lastName} onChange={e => setEditForm(prev => ({...prev, lastName: e.target.value}))} required />
                  </div>
                  <div className="form-group">
                    <label>{t("dobLabel")}</label>
                    <input type="date" className="input-field" value={editForm.dob} onChange={e => setEditForm(prev => ({...prev, dob: e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label>{t("phoneNumberLabel")}</label>
                    <input type="tel" className="input-field" value={editForm.phoneNumber} onChange={e => setEditForm(prev => ({...prev, phoneNumber: e.target.value}))} placeholder="+94 7X XXX XXXX" />
                  </div>
                  <div className="form-group full-width">
                    <label>{t("emailLabel")}</label>
                    <input type="email" className="input-field" value={editForm.email} onChange={e => setEditForm(prev => ({...prev, email: e.target.value}))} required disabled={user?.isDevAdmin} />
                  </div>
                  <div className="form-group full-width">
                    <label>{t("bioLabel")}</label>
                    <textarea className="input-field" rows={3} value={editForm.bio} onChange={e => setEditForm(prev => ({...prev, bio: e.target.value}))} placeholder={t("bioPlaceholder")} />
                  </div>
                  <div className="form-group">
                    <label>{t("passwordLabel")}</label>
                    <input type="password" className="input-field" value={editForm.password} onChange={e => setEditForm(prev => ({...prev, password: e.target.value}))} placeholder="••••••••" disabled={user?.isDevAdmin} />
                  </div>
                  <div className="form-group">
                    <label>{t("confirmPasswordLabel")}</label>
                    <input type="password" className="input-field" value={editForm.confirmPassword} onChange={e => setEditForm(prev => ({...prev, confirmPassword: e.target.value}))} placeholder="••••••••" disabled={user?.isDevAdmin} />
                  </div>
                </div>

                <div className="edit-card-actions">
                  <button type="submit" className="btn-save" disabled={saving}>
                    {saving ? t("savingProgress") : t("saveButton")}
                  </button>
                  <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)} disabled={saving}>
                    {t("cancelButton")}
                  </button>
                </div>
              </form>
            )}

            {!isEditing && isGuideMode && (
              <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                <div style={{ 
                  padding: 32, 
                  background: "var(--gray-50)", 
                  borderRadius: 24,
                  border: "1px solid var(--gray-100)",
                  boxShadow: "var(--shadow-sm)",
                  transition: "transform 0.3s ease",
                  cursor: "default"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                    <span style={{ fontSize: 24 }}>🌟</span>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: -0.5 }}>Professional DNA</h3>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <small style={{ color: "var(--teal)", textTransform: "uppercase", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>Expertise & Skills</small>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                        {user?.expertise?.length > 0 ? (
                          user.expertise.map(exp => (
                            <span key={exp} style={{ 
                              padding: "6px 14px", 
                              borderRadius: 12, 
                              background: "var(--teal-light)", 
                              color: "var(--teal-dark)", 
                              fontSize: 13, 
                              fontWeight: 600,
                              border: "1px solid var(--teal-mid)",
                              boxShadow: "var(--shadow-sm)"
                            }}>
                              {exp.charAt(0).toUpperCase() + exp.slice(1)}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: "var(--gray-500)", fontStyle: "italic" }}>No expertise selected yet</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <small style={{ color: "var(--teal)", textTransform: "uppercase", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>Linguistic Mastery</small>
                      </div>
                      <p style={{ margin: 0, fontSize: 15, color: "var(--gray-200)", lineHeight: 1.6 }}>
                        {user?.languages?.length > 0 ? user.languages.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(" • ") : "English (Default)"}
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ 
                  padding: 32, 
                  background: "var(--gray-50)", 
                  borderRadius: 24,
                  border: "1px solid var(--gray-100)",
                  boxShadow: "var(--shadow-sm)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                    <span style={{ fontSize: 24 }}>💼</span>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: -0.5 }}>Experience Hub</h3>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                      <div style={{ background: "var(--white)", padding: 16, borderRadius: 16, border: "1px solid var(--gray-100)" }}>
                        <small style={{ color: "var(--gray-400)", textTransform: "uppercase", fontSize: 10, fontWeight: 700, display: "block", marginBottom: 4 }}>Tenure</small>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{user?.experienceYears || 0} <span style={{ fontSize: 12, fontWeight: 400, color: "var(--gray-400)" }}>Years</span></p>
                      </div>
                      <div style={{ background: "var(--white)", padding: 16, borderRadius: 16, border: "1px solid var(--gray-100)" }}>
                        <small style={{ color: "var(--gray-400)", textTransform: "uppercase", fontSize: 10, fontWeight: 700, display: "block", marginBottom: 4 }}>Rate</small>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--teal)" }}>{user?.hourlyRate || "$25"}<span style={{ fontSize: 12, fontWeight: 400, color: "var(--gray-400)" }}>/hr</span></p>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <small style={{ color: "var(--teal)", textTransform: "uppercase", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>Active Domain</small>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18 }}>📍</span>
                        <p style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>{user?.location || "Colombo, Sri Lanka"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isEditing && !isGuideMode && profile && (
              <div style={{ 
                marginTop: 24, 
                padding: "24px", 
                background: "var(--white)", 
                borderRadius: 12, 
                boxShadow: "var(--shadow-sm)",
                border: `3px solid ${getLevelDetails(profile.xp).color}`
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h2 style={{ fontSize: "1.4rem", margin: 0, color: getLevelDetails(profile.xp).color, display: "flex", alignItems: "center", gap: "8px" }}>
                    Level {getLevelDetails(profile.xp).level} Traveler
                  </h2>
                  <div style={{ background: "var(--teal-light)", color: "var(--teal-dark)", padding: "6px 16px", borderRadius: 20, fontWeight: "bold", fontSize: "1.1rem", border: "1px solid var(--gray-100)" }}>
                    {profile.xp || 0} XP
                  </div>
                </div>

                {getLevelDetails(profile.xp).level < 10 && (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--gray-600)", marginBottom: 6 }}>
                      <span>Progress to Level {getLevelDetails(profile.xp).level + 1}</span>
                      <span>{profile.xp || 0} / {getLevelDetails(profile.xp).nextMin} XP</span>
                    </div>
                    <div style={{ width: "100%", height: "10px", background: "var(--gray-100)", borderRadius: "10px", overflow: "hidden", border: "1px solid var(--gray-200)" }}>
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
                      {profile.badges.map(b => {
                        const isEmoji = !b.url || (!b.url.startsWith("http") && !b.url.startsWith("data:image"));
                        return (
                          <div key={b.id} className="hexagon" title={b.name} style={{ border: `1px solid ${getLevelDetails(profile.xp).color}33`, position: "relative" }}>
                            {isEmoji ? (
                              <div style={{ 
                                position: "relative", zIndex: 2, 
                                background: "rgba(255,255,255,0.95)", 
                                width: "54px", height: "54px", 
                                borderRadius: "50%", 
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), inset 0 2px 4px rgba(0,0,0,0.05)",
                                border: "1px solid rgba(0,0,0,0.05)"
                              }}>
                                <span style={{ fontSize: "2rem", filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.1))" }}>{b.url || "🥉"}</span>
                              </div>
                            ) : (
                              <img src={b.url} alt={b.name} style={{ width: "100%", height: "100%", objectFit: "cover", position: "relative", zIndex: 2 }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {!isGuideMode && (
              <div style={{ marginTop: 32, padding: 24, background: "var(--white)", borderRadius: 12, border: "1px solid var(--gray-100)", boxShadow: "var(--shadow-sm)" }}>
                <h2 style={{ fontSize: "1.2rem", marginBottom: 8, color: "var(--text)" }}>{t("profileTravelerQuests")}</h2>
                <p style={{ color: "var(--gray-600)", marginBottom: 16 }}>
                  {t("profileTravelerQuestsDesc")}
                </p>
                <button className="btn-primary" onClick={() => showScreen("screen-quests")}>
                  {t("profileViewQuests")}
                </button>
              </div>
            )}

            <button className="forgot-link" style={{ 
              marginTop: 48, 
              padding: "12px 24px", 
              fontSize: 14, 
              fontWeight: 600, 
              color: "#ff4757",
              background: "var(--gray-100)",
              border: "1px solid var(--gray-200)",
              borderRadius: 12,
              cursor: "pointer",
              transition: "all 0.2s"
            }} onClick={handleLogout}>
              {t("profileSignOut")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
