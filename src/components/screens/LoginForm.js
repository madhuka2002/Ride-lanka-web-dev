"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { isAdminEmail } from "@/lib/adminAuth";
import { useSettings } from "@/context/SettingsContext";

export default function LoginForm({ onSignIn }) {
  const router = useRouter();
  const { signIn } = useAuth();
  const { t } = useSettings();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn() {
    if (!email || !password) {
      setError(t("loginErrorEmpty"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const signedInUser = await signIn(email, password);
      if (isAdminEmail(signedInUser?.email)) {
        router.push("/admin");
        return;
      }
      onSignIn();
    } catch (e) {
      setError(e.message || t("loginErrorFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="tab-login" className="auth-form">
      <h3>{t("loginWelcomeBack")}</h3>
      <p className="subtitle">{t("loginSubtitle")}</p>
      <div className="form-group">
        <label>{t("loginEmailLabel")}</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>{t("loginPasswordLabel")}</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="forgot-link">{t("loginForgotPassword")}</div>
      {error && <p style={{ color: "red", marginBottom: 8, fontSize: 13 }}>{error}</p>}
      <button className="btn-teal" onClick={handleSignIn} disabled={loading}>
        {loading ? t("loginSigningIn") : t("loginSignIn")}
      </button>
    </div>
  );
}
