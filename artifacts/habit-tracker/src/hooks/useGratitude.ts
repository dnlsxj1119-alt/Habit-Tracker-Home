import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "gratitude_entries";

export function useGratitude() {
  const [entries, setEntries] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load gratitude entries", e);
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const saveEntry = useCallback((dateStr: string, text: string) => {
    setEntries(prev => {
      const updated = { ...prev };
      if (text.trim() === "") {
        delete updated[dateStr];
      } else {
        updated[dateStr] = text;
      }
      return updated;
    });
  }, []);

  const getEntry = useCallback((dateStr: string) => {
    return entries[dateStr] || "";
  }, [entries]);

  return {
    entries,
    saveEntry,
    getEntry,
  };
}
