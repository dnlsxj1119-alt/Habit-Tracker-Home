import { useState, useEffect } from "react";

export type ThemeColor = "blue" | "green" | "purple" | "pink" | "orange";

const STORAGE_KEY = "app-settings";

export interface Settings {
  themeColor: ThemeColor;
}

const defaultSettings: Settings = {
  themeColor: "blue",
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    document.documentElement.setAttribute("data-theme", settings.themeColor);
  }, [settings]);

  const updateTheme = (color: ThemeColor) => {
    setSettings((prev) => ({ ...prev, themeColor: color }));
  };

  return {
    settings,
    updateTheme,
  };
}
