"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

export default function AuthScreen({ active, onSignIn, onSignUp }) {
  const [activeTab, setActiveTab] = useState("login");

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div id="screen-auth" className={`screen ${active ? "active" : ""}`}>
      <div className="auth-left">
        <div className="auth-left-content">
          <h2>
            Every journey begins
            <br />
            with a single step.
          </h2>
          <p>Join millions of travelers who plan their dream trips with DreamTrip.</p>
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
            Sign In
          </div>
          <div
            className={`auth-tab ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => switchTab("signup")}
            role="button"
            tabIndex={0}
          >
            Create Account
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
