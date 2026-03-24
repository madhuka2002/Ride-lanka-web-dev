"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useGuideAuth } from "@/context/GuideAuthContext";
import { useAppMode } from "@/context/AppModeContext";
import { useSettings } from "@/context/SettingsContext";

const INTEREST_OPTIONS = [
  { id: "culture", label: "Culture", emoji: "🏛️" },
  { id: "hiking", label: "Hiking", emoji: "🥾" },
  { id: "beach", label: "Beach", emoji: "🏖️" },
  { id: "wildlife", label: "Wildlife", emoji: "🐘" },
  { id: "nature", label: "Nature", emoji: "🌿" },
  { id: "food", label: "Food", emoji: "🍛" },
  { id: "adventure", label: "Adventure", emoji: "⛰️" },
  { id: "dance", label: "Dance", emoji: "💃" },
];

function IconUser() {
  return (
    <svg className="auth-input-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M5 20v-1a7 7 0 0114 0v1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMail() {
  return (
    <svg className="auth-input-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16v12H4V6zm0 0 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLock() {
  return (
    <svg className="auth-input-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 10V7a4 4 0 118 0v3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export default function SignUpForm({ onSignUp }) {
  const { signUp } = useAuth();
  const { guideSignUp } = useGuideAuth();
  const { isGuideMode } = useAppMode();
  const { t } = useSettings();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleInterest(id) {
    setInterests((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }

  async function handleSubmit() {
    if (interests.length === 0 && !isGuideMode) {
      setError(t("signupErrorSelectInterest"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (isGuideMode) {
        await guideSignUp(email, password);
      } else {
        await signUp(email, password, name, interests);
      }
      onSignUp();
    } catch (e) {
      setError(e.message || t("signupErrorFailed"));
    } finally {
      setLoading(false);
    }
  }


  return (
    <div id="tab-signup" className="auth-form" role="tabpanel" aria-labelledby="auth-tab-signup">

      {!isGuideMode && (
        <div className="auth-stepper" aria-hidden>
          <span className={`auth-stepper-dot${step === 1 ? " active" : ""}${step === 2 ? " done" : ""}`}>1</span>
          <span className={`auth-stepper-line${step === 2 ? " active" : ""}`} />
          <span className={`auth-stepper-dot${step === 2 ? " active" : ""}`}>2</span>
        </div>
      )}

      {step === 1 && (
        <>
          <div className="auth-form-head">
            <h3>{t("signupTitle")}</h3>
            <p className="subtitle">{isGuideMode ? "Create your professional guide account" : t("signupSubtitle")}</p>
          </div>
          {error ? (
            <div className="auth-alert" role="alert">
              <span className="auth-alert-dot" aria-hidden />
              <span>{error}</span>
            </div>
          ) : null}
          <div className="form-group auth-field">
            <label htmlFor="signup-name">{t("signupFullName")}</label>
            <div className="auth-input-shell">
              <span className="auth-input-icon">
                <IconUser />
              </span>
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group auth-field">
            <label htmlFor="signup-email">Email Address</label>
            <div className="auth-input-shell">
              <span className="auth-input-icon">
                <IconMail />
              </span>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group auth-field">
            <label htmlFor="signup-password">Password</label>
            <div className="auth-input-shell">
              <span className="auth-input-icon">
                <IconLock />
              </span>
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            type="button"
            className="btn-teal btn-teal-glow"
            onClick={() => {
              if (!name || !email || !password) {
                setError(t("signupErrorFillAll"));
                return;
              }
              if (password.length < 6) {
                setError(t("signupErrorPasswordLen"));
                return;
              }
              setError("");
              if (isGuideMode) {
                handleSubmit();
              } else {
                setStep(2);
              }
            }}
          >
            {isGuideMode ? (loading ? t("signupCreating") : t("signupCreateAccount")) : t("signupNext")}
          </button>
        </>
      )}


      {step === 2 && (
        <>
          <div className="auth-form-head">
            <h3>{t("signupInterestsTitle")}</h3>
            <p className="subtitle">{t("signupInterestsSubtitle")}</p>
          </div>
          <div className="auth-interest-hint">{t("authInterestHint")}</div>
          <div className="auth-interest-grid">
            {INTEREST_OPTIONS.map((opt) => {
              const selected = interests.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleInterest(opt.id)}
                  className={`auth-interest-chip${selected ? " selected" : ""}`}
                >
                  <span className="auth-interest-emoji" aria-hidden>
                    {opt.emoji}
                  </span>
                  <span className="auth-interest-label">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {error ? (
            <div className="auth-alert" role="alert">
              <span className="auth-alert-dot" aria-hidden />
              <span>{error}</span>
            </div>
          ) : null}

          <button type="button" className="btn-teal btn-teal-glow" onClick={handleSubmit} disabled={loading}>
            {loading ? t("signupCreating") : t("signupCreateAccount")}
          </button>
          <button type="button" className="auth-link-back" onClick={() => setStep(1)}>
            {t("signupBack")}
          </button>
        </>
      )}
    </div>
  );
}
