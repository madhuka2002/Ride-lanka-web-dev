"use client";

import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { useAuth } from "@/context/AuthContext";
import { getQuests, verifyQuest, getUserProfile } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";

export default function QuestsScreen({ active, showScreen }) {
  const { user, token } = useAuth();
  const { t } = useSettings();
  const [quests, setQuests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);
  const [verifyId, setVerifyId] = useState(null);
  const [story, setStory] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const displayName = user?.displayName || user?.email?.split("@")[0] || "traveler";

  useEffect(() => {
    if (active && token) {
      loadQuests();
    }
  }, [active, token]);

  async function loadQuests() {
    try {
      setLoading(true);
      const [res, prof] = await Promise.all([
        getQuests(token),
        getUserProfile(token)
      ]);
      setQuests(res.quests || []);
      setProfile(prof);
    } catch (err) {
      console.error("Failed to load quests/profile:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyQuest() {
    if (!token || !verifyId || !story) return;
    try {
      setVerifying(true);
      setAiMessage("Ride-Lanka AI is verifying your story...");
      const res = await verifyQuest(token, verifyId, story);
      setAiMessage(`✅ ${res.message}`);
      
      // Wait a bit to show success message then close and reload
      setTimeout(async () => {
        setVerifyId(null);
        setStory("");
        setAiMessage("");
        await loadQuests();
      }, 2500);
    } catch (err) {
      setAiMessage(`❌ ${err.message}`);
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div id="screen-quests" className={`screen ${active ? "active" : ""}`}>
      <div className="main-layout">
        <Sidebar activeItem="quests" userName={displayName} userRole={t("appRoleTripPlanner")} onNavigate={showScreen} />
        
        <div className="main-content">
          <div className="topbar">
            <h1>{t("questsTitle")}</h1>
          </div>
          
          <div className="quests-container" style={{ marginTop: 24, padding: "0 16px" }}>
            <p style={{ color: "var(--gray-600)", marginBottom: "24px" }}>{t("questsSubtitle")}</p>

            {loading ? (
              <p>{t("questsLoading")}</p>
            ) : quests.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", background: "var(--white)", borderRadius: "12px", border: "1px solid var(--gray-100)", boxShadow: "var(--shadow-sm)" }}>
                <p>{t("questsEmpty")}</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "16px" }}>
                {quests.map((q) => (
                  <div key={q.id} style={{ 
                    background: "var(--white)", 
                    padding: "20px", 
                    borderRadius: "12px", 
                    boxShadow: "var(--shadow-sm)",
                    border: "1px solid var(--gray-100)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ 
                          fontSize: "2rem", 
                          width: 44, 
                          height: 44, 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          background: "var(--gray-50)",
                          borderRadius: "12px",
                          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)"
                        }}>
                          {q.badgeImage || "🥉"}
                        </span>
                        <div>
                          <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--text)" }}>{q.title}</h3>
                          <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                            <span style={{ 
                              fontSize: "0.75rem", 
                              fontWeight: "600",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              color: q.level === 'gold' ? '#b45309' : q.level === 'silver' ? '#475569' : '#92400e',
                              background: q.level === 'gold' ? '#fef3c7' : q.level === 'silver' ? '#f1f5f9' : '#ffedd5',
                              padding: "2px 8px",
                              borderRadius: "4px"
                            }}>
                              {q.level || 'bronze'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span style={{ 
                        background: "var(--teal-light)", 
                        color: "var(--teal-dark)", 
                        padding: "4px 12px", 
                        borderRadius: "16px",
                        fontSize: "0.85rem",
                        fontWeight: "600"
                      }}>
                        {q.reward}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: "var(--gray-600)", lineHeight: "1.5" }}>{q.description}</p>
                    <div style={{ marginTop: "12px" }}>
                      {profile?.completedQuests?.includes(q.id) ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                           <span style={{ fontSize: "0.85rem", color: "var(--teal)", fontWeight: "600" }}>✓ {t("questsCompleted")}</span>
                        </div>
                      ) : (
                        <button 
                          className="btn-outline" 
                          style={{ fontSize: "0.9rem", padding: "8px 16px", border: "2px solid var(--teal)", color: "var(--teal)", background: "transparent", cursor: "pointer", borderRadius: "8px", fontWeight: "600" }}
                          onClick={() => setVerifyId(q.id)}
                        >
                          ✨ Share Experience to Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Verification Modal-like Overlay */}
      {verifyId && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, backdropFilter: "blur(4px)"
        }}>
          <div style={{
            background: "var(--white)", padding: "32px", borderRadius: "20px", maxWidth: "500px", width: "90%",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)"
          }}>
            <h2 style={{ margin: "0 0 8px 0" }}>Share your Story ✨</h2>
            <p style={{ color: "var(--gray-600)", marginBottom: "20px" }}>
              Tell us a bit about your visit to this location. Ride-Lanka AI will verify your experience to award your reward.
            </p>
            
            <textarea 
              placeholder="e.g. The climb to the top of Sigiriya was challenging but amazing! The view from the Lion's Paw is unforgettable..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              disabled={verifying}
              style={{
                width: "100%", height: "120px", padding: "12px", borderRadius: "12px", border: "1px solid var(--gray-200)",
                fontSize: "1rem", marginBottom: "16px", resize: "none", outline: "none"
              }}
            />
            
            {aiMessage && (
              <div style={{ 
                padding: "12px", borderRadius: "8px", marginBottom: "16px", 
                background: aiMessage.includes('❌') ? '#fef2f2' : aiMessage.includes('✅') ? '#f0fdf4' : '#f0f9ff',
                color: aiMessage.includes('❌') ? '#991b1b' : aiMessage.includes('✅') ? '#166534' : '#075985',
                fontSize: "0.9rem"
              }}>
                {aiMessage}
              </div>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              <button 
                onClick={handleVerifyQuest}
                disabled={verifying || story.trim().split(/\s+/).length < 5}
                className="btn-solid"
                style={{ flex: 1, padding: "12px", borderRadius: "12px", background: "var(--teal)", color: "white", border: "none", cursor: "pointer", fontWeight: "600" }}
              >
                {verifying ? "Verifying..." : "Submit for AI Review"}
              </button>
              {!verifying && (
                <button 
                  onClick={() => { setVerifyId(null); setStory(""); setAiMessage(""); }}
                  style={{ padding: "12px 20px", borderRadius: "12px", background: "var(--gray-100)", border: "none", cursor: "pointer" }}
                >
                  Cancel
                </button>
              )}
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--gray-400)", textAlign: "center", marginTop: "16px" }}>
              Powered by Ride-Lanka Pro AI Verification Engine
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
