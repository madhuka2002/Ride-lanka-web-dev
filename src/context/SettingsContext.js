"use client";

import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState("system"); // light, dark, system
  const [language, setLanguage] = useState("en"); // en, si, ta
  const [notifications, setNotifications] = useState({
    email: true,
    push: true
  });
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    tracking: true
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ride-lanka-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.privacy) setPrivacy(parsed.privacy);
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    }
  }, []);

  // Save to localStorage and apply theme
  useEffect(() => {
    localStorage.setItem("ride-lanka-settings", JSON.stringify({
      theme, language, notifications, privacy
    }));

    // Apply dark mode class to html
    const root = window.document.documentElement;
    if (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme, language, notifications, privacy]);

  return (
    <SettingsContext.Provider value={{ 
      theme, setTheme, 
      language, setLanguage, 
      notifications, setNotifications,
      privacy, setPrivacy 
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within a SettingsProvider");
  return context;
}
