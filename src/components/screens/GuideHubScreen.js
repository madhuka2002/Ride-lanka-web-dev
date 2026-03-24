"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Sidebar from "../Sidebar";
import { useGuideAuth } from "@/context/GuideAuthContext";
import { useAppMode } from "@/context/AppModeContext";
import { useSettings } from "@/context/SettingsContext";
import { guideStorage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getGuideProfile,
  saveMyGuideProfile,
  GUIDE_EXPERTISE_OPTIONS,
  GUIDE_LANGUAGE_OPTIONS,
} from "@/lib/tourGuides";

export default function GuideHubScreen({ active, showScreen }) {
  const { guide: user } = useGuideAuth();
  const { setMode } = useAppMode();
  const { t } = useSettings();
  const fileInputRef = useRef(null);
  
  const displayName = user?.displayName || user?.email?.split("@")[0] || "traveler";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const [displayNameF, setDisplayNameF] = useState("");
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [languages, setLanguages] = useState([]);
  const [expertise, setExpertise] = useState([]);
  const [experienceYears, setExperienceYears] = useState(0);
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [availabilityNote, setAvailabilityNote] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [listingActive, setListingActive] = useState(true);
  const [accountStatus, setAccountStatus] = useState("active");

  const loadProfile = useCallback(async () => {
    if (!user?.uid) return;
    const g = await getGuideProfile(user.uid);
    if (g) {
      setDisplayNameF(g.displayName || "");
      setHeadline(g.headline || "");
      setLocation(g.location || "");
      setLanguages(Array.isArray(g.languages) ? g.languages : []);
      setExpertise(g.expertise || []);
      setExperienceYears(g.experienceYears || 0);
      setBio(g.bio || "");
      setHourlyRate(String(g.hourlyRate || ""));
      setAvailabilityNote(g.availabilityNote || "");
      setPhotoURL(g.photoURL || "");
      setListingActive(g.active !== false);
      setAccountStatus(g.status || "active");
    } else {
      setDisplayNameF(user.displayName || user.email?.split("@")[0] || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  useEffect(() => {
    if (!active || !user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      await loadProfile();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [active, user, loadProfile]);

  function toggleExpertise(id) {
    setExpertise((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleLanguage(id) {
    setLanguages((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !user?.uid) return;

    setUploading(true);
    try {
      const storageRef = ref(guideStorage, `profilePhotos/${user.uid}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setPhotoURL(url);
      setSaveMsg("Photo uploaded successfully!");
    } catch (err) {
      console.error(err);
      setSaveMsg("Photo upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaveMsg("");
    try {
      await saveMyGuideProfile(user, {
        displayName: displayNameF,
        headline,
        location,
        languages: languages,
        expertise,
        experienceYears,
        bio,
        hourlyRate: hourlyRate, 
        availabilityNote,
        photoURL,
        active: listingActive,
      });
      setSaveMsg(t("profileSavedSuccess"));
    } catch (err) {
      setSaveMsg(err.message || t("profileSaveError"));
    } finally {
      setSaving(false);
    }
  }

  if (!user && active) {
    return (
      <div id="screen-guide-hub" className={`screen ${active ? "active" : ""}`}>
        <div className="main-layout">
          <Sidebar activeItem="guide-dashboard" userName={displayName} userRole="Tour guide" onNavigate={showScreen} />
          <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: 40, textAlign: "center", maxWidth: 500 }}>
              <h3>{t("signInToAccessHub")}</h3>
              <button
                type="button"
                className="btn-teal"
                style={{ marginTop: 24 }}
                onClick={() => {
                  setMode("guide");
                  showScreen("screen-auth");
                }}
              >
                {t("splashSignIn")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (accountStatus !== "active" && active) {
    return (
      <div id="screen-guide-hub" className={`screen ${active ? "active" : ""}`}>
        <div className="main-layout">
          <Sidebar activeItem="guide-dashboard" userName={displayName} userRole="Tour guide" onNavigate={showScreen} />
          <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: 60, textAlign: "center", maxWidth: 600, border: "1px solid #ef4444" }}>
              <div style={{ fontSize: 64, marginBottom: 24 }}>🚫</div>
              <h2 style={{ color: "#ef4444", marginBottom: 16 }}>
                {accountStatus === "blocked" ? "Account Blocked" : "Account Suspended"}
              </h2>
              <p style={{ color: "#94a3b8", lineHeight: 1.6, marginBottom: 32 }}>
                Your professional guide account has been {accountStatus} by the Ride Lanka administration. 
                During this time, your profile is hidden from travelers and you cannot manage bookings or stories.
              </p>
              <div style={{ padding: 16, background: "rgba(255, 255, 255, 0.03)", borderRadius: 12, fontSize: 14, color: "#64748b" }}>
                Please contact support at <strong>admin@ridelanka.com</strong> for more information or to appeal this decision.
              </div>
              <button className="btn-teal" style={{ marginTop: 32 }} onClick={() => setMode("traveler")}>
                Return to Traveler Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="screen-guide-hub" className={`screen ${active ? "active" : ""}`}>
      <div className="main-layout">
        <Sidebar activeItem="guide-dashboard" userName={displayName} userRole="Tour guide" onNavigate={showScreen} />
        <div className="main-content">
          <div className="topbar">
            <div>
              <h1>{t("hubTitle")}</h1>
              <div className="subtitle">{t("hubSubtitle")}</div>
            </div>
          </div>

          {loading ? (
            <p className="subtitle">{t("loadingData")}</p>
          ) : (
            <form className="settings-card" onSubmit={handleSave} style={{ padding: 24, width: "100%" }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 24 }}>
                <h3 style={{ margin: 0 }}>{t("editProfileHeader")}</h3>
                <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                  <input type="checkbox" checked={listingActive} onChange={(e) => setListingActive(e.target.checked)} />
                  {t("listProfilePublicly")}
                </label>
              </div>

              <div style={{ display: "flex", gap: 32, marginBottom: 32, alignItems: "start" }}>
                <div style={{ position: "relative" }}>
                  <div style={{ 
                    width: 140, 
                    height: 140, 
                    borderRadius: "50%", 
                    overflow: "hidden", 
                    background: "var(--gray-100)",
                    border: "4px solid white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}>
                    {photoURL ? (
                      <img src={photoURL} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--gray-400)" }}>
                        No Photo
                      </div>
                    )}
                  </div>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ 
                      position: "absolute", 
                      bottom: 0, 
                      right: 0, 
                      background: "var(--teal)", 
                      color: "white", 
                      border: "none", 
                      borderRadius: "50%", 
                      width: 40, 
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                    }}
                  >
                    📷
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handlePhotoUpload} 
                    accept="image/*" 
                    style={{ display: "none" }} 
                  />
                  {uploading && <p style={{ fontSize: 11, textAlign: "center", marginTop: 8 }}>Uploading...</p>}
                </div>

                <div style={{ flex: 1 }}>
                  <div className="form-group">
                    <label>{t("displayNameLabel")}</label>
                    <input value={displayNameF} onChange={(e) => setDisplayNameF(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>{t("headlineLabel")}</label>
                    <input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder={t("headlinePlaceholder")} />
                  </div>
                </div>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div className="form-group">
                  <label>{t("locationLabel")}</label>
                  <input value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>{t("hourlyRateLabel")}</label>
                  <input value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="e.g. $25" />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontWeight: 600, marginBottom: 12 }}>{t("languagesLabel")}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 }}>
                  {GUIDE_LANGUAGE_OPTIONS.map((opt) => (
                    <label key={opt.id} style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 10, 
                      cursor: "pointer",
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: languages.includes(opt.id) ? "rgba(11, 168, 145, 0.1)" : "rgba(255, 255, 255, 0.03)",
                      border: "1.5px solid",
                      borderColor: languages.includes(opt.id) ? "var(--teal)" : "rgba(255, 255, 255, 0.1)",
                      transition: "all 0.2s"
                    }}>
                      <input 
                        type="checkbox" 
                        checked={languages.includes(opt.id)} 
                        onChange={() => toggleLanguage(opt.id)}
                        style={{ width: 18, height: 18, accentColor: "var(--teal)" }}
                      />
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontWeight: 600, marginBottom: 12 }}>{t("expertiseLabel")}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {GUIDE_EXPERTISE_OPTIONS.map((opt) => (
                    <button key={opt.id} type="button" className={`cat-chip${expertise.includes(opt.id) ? " active" : ""}`} onClick={() => toggleExpertise(opt.id)}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>{t("experienceYearsLabel")}</label>
                <input type="number" min={0} max={60} value={experienceYears} onChange={(e) => setExperienceYears(Number(e.target.value))} />
              </div>
              <div className="form-group">
                <label>{t("bioLabel")}</label>
                <textarea rows={6} value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
              <div className="form-group">
                <label>{t("availabilityLabel")}</label>
                <textarea rows={2} value={availabilityNote} onChange={(e) => setAvailabilityNote(e.target.value)} placeholder={t("availabilityPlaceholder")} />
              </div>

              {saveMsg ? (
                <div style={{ 
                  padding: 12, 
                  borderRadius: 8, 
                  background: saveMsg.toLowerCase().includes("fail") || saveMsg.toLowerCase().includes("error") ? "rgba(255, 71, 87, 0.1)" : "rgba(11, 168, 145, 0.1)",
                  color: saveMsg.toLowerCase().includes("fail") || saveMsg.toLowerCase().includes("error") ? "#ff4757" : "var(--teal)",
                  marginBottom: 20,
                  fontSize: 14,
                  fontWeight: 600,
                  textAlign: "center"
                }}>
                  {saveMsg}
                </div>
              ) : null}
              
              <button type="submit" className="btn-teal" disabled={saving} style={{ padding: "16px", fontSize: 16 }}>
                {saving ? t("savingProgress") : t("saveProfileButton")}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
