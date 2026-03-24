"use client";
import { useSettings } from "@/context/SettingsContext";

export default function SplashScreen({ active, onGetStarted, onSignIn, onGuideSignIn }) {
  const { t } = useSettings();
  return (
    <div id="screen-splash" className={`screen ${active ? "active" : ""}`}>
      <div className="splash-guide-login-wrap">
        <button type="button" className="splash-guide-login-btn" onClick={onGuideSignIn}>
          {t("splashGuideLogin")}
        </button>
      </div>
      <div className="splash-content">
        <div className="splash-logo">🌍</div>
        <h1>
          {t("splashTitleLine1")}
          <br />
          {t("splashTitleLine2")}
        </h1>
        <p>{t("splashSubtitle")}</p>
        <div className="splash-actions">
          <button className="btn-primary" onClick={onGetStarted}>
            {t("splashGetStarted")}
          </button>
          <button className="btn-outline" onClick={onSignIn}>
            {t("splashSignIn")}
          </button>
        </div>
        <div className="splash-dots">
          <span className="active" />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
