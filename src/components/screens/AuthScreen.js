"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { useSettings } from "@/context/SettingsContext";

export default function AuthScreen({ active, onSignIn, onSignUp }) {
  const [activeTab, setActiveTab] = useState("login");
  const { t } = useSettings();

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div id="screen-auth" className={`screen ${active ? "active" : ""}`}>
      <div className="auth-left">
        <div className="auth-left-content">
          <h2>
            {t("authHeroTitleLine1")}
            <br />
            {t("authHeroTitleLine2")}
          </h2>
          <p>{t("authHeroSubtitle")}</p>
        </div>
      </div>
      <div className="auth-right">
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "var(--teal)",
              fontFamily: "'Playfair Display',serif",
            }}
          >
            Ride Lanka 
          </div>
        </div>
        <div className="auth-tabs">
          <div
            className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => switchTab("login")}
            role="button"
            tabIndex={0}
          >
            {t("authSignInTab")}
          </div>
          <div
            className={`auth-tab ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => switchTab("signup")}
            role="button"
            tabIndex={0}
          >
            {t("authCreateAccountTab")}
          </div>
        </div>
        {activeTab === "login" ? (
          <LoginForm onSignIn={onSignIn} />
        ) : (
          <SignUpForm onSignUp={onSignUp} />
        )}
      </div>
    </div>
  );
}
