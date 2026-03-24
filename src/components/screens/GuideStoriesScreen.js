"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { useGuideAuth } from "@/context/GuideAuthContext";
import { useSettings } from "@/context/SettingsContext";
import {
  getGuideProfile,
  saveMyGuideProfile,
} from "@/lib/tourGuides";

export default function GuideStoriesScreen({ active, showScreen }) {
  const { guide: user } = useGuideAuth();
  const { t } = useSettings();
  const displayName = user?.displayName || user?.email?.split("@")[0] || "traveler";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stories, setStories] = useState([]);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyBody, setStoryBody] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  const loadStories = useCallback(async () => {
    if (!user?.uid) return;
    const g = await getGuideProfile(user.uid);
    if (g) {
      setStories(Array.isArray(g.stories) ? g.stories : []);
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
      await loadStories();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [active, user, loadStories]);

  function addStory() {
    if (!storyTitle.trim() && !storyBody.trim()) return;
    const newStory = { 
      id: String(Date.now()), 
      title: storyTitle.trim() || t("untitledStory"), 
      body: storyBody.trim(),
      createdAt: new Date().toISOString()
    };
    setStories((s) => [newStory, ...s]);
    setStoryTitle("");
    setStoryBody("");
  }

  function removeStory(id) {
    setStories((s) => s.filter((x) => x.id !== id));
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setSaveMsg("");
    try {
      await saveMyGuideProfile(user, { stories });
      setSaveMsg(t("storiesSavedHighlight"));
    } catch (err) {
      setSaveMsg(err.message || t("saveFailedAlert"));
    } finally {
      setSaving(false);
    }
  }

  if (!user && active) {
    return (
      <div id="screen-guide-stories" className={`screen ${active ? "active" : ""}`}>
        <div className="main-layout">
          <Sidebar activeItem="guide-stories" userName={displayName} userRole="Tour guide" onNavigate={showScreen} />
          <div className="main-content">
            <p>{t("signInToAccessHub")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="screen-guide-stories" className={`screen ${active ? "active" : ""}`}>
      <div className="main-layout">
        <Sidebar activeItem="guide-stories" userName={displayName} userRole="Tour guide" onNavigate={showScreen} />
        <div className="main-content">
          <div className="topbar">
            <div>
              <h1>{t("stories")}</h1>
              <div className="subtitle">{t("storiesSubtitle")}</div>
            </div>
            <button className="btn-teal" style={{ width: 'auto', padding: '10px 24px' }} onClick={handleSave} disabled={saving}>
              {saving ? t("savingProgress") : t("saveAllStories")}
            </button>
          </div>

          {loading ? (
            <p className="subtitle">{t("loadingData")}</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: 32, alignItems: "start" }}>
              <div className="settings-card" style={{ padding: 24 }}>
                <h3 style={{ marginBottom: 20 }}>{t("writeNewStory")}</h3>
                <div className="form-group">
                  <label>{t("storyTitleLabel")}</label>
                  <input value={storyTitle} onChange={(e) => setStoryTitle(e.target.value)} placeholder={t("storyTitlePlaceholder")} />
                </div>
                <div className="form-group">
                  <label>{t("storyBodyLabel")}</label>
                  <textarea rows={8} value={storyBody} onChange={(e) => setStoryBody(e.target.value)} placeholder={t("storyBodyPlaceholder")} />
                </div>
                <button type="button" className="social-btn" onClick={addStory} style={{ width: 'auto', padding: '12px 24px' }}>
                  {t("addStoryButton")}
                </button>
                {saveMsg && <p style={{ marginTop: 16, color: "var(--teal)", fontWeight: 600 }}>{saveMsg}</p>}
              </div>

              <div>
                <h3 style={{ marginBottom: 16 }}>{t("yourStoriesLabel")} ({stories.length})</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {stories.length === 0 ? (
                    <p className="subtitle">{t("noStoriesFound")}</p>
                  ) : (
                    stories.map((s) => (
                      <div key={s.id} className="notif-item" style={{ 
                        padding: 16, 
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid var(--gray-100)"
                      }}>
                        <strong style={{ display: "block", fontSize: 15, marginBottom: 4 }}>{s.title}</strong>
                        <p style={{ fontSize: 13, color: "var(--gray-400)", marginBottom: 12 }}>
                          {s.body?.slice(0, 80)}...
                        </p>
                        <button type="button" className="forgot-link" style={{ fontSize: 12, color: "#ff4757" }} onClick={() => removeStory(s.id)}>
                          {t("removeButtonLabel")}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
