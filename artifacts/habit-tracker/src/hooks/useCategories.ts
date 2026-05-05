import { useState, useCallback } from "react";

const STORAGE_KEY = "categories";
const DEFAULT_CATEGORIES = ["건강", "운동", "학습", "마음", "생활", "기타"];

export function useCategories() {
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: string[] = JSON.parse(saved);
        // Merge defaults (in order) with any user-added ones
        const merged = [
          ...DEFAULT_CATEGORIES,
          ...parsed.filter(c => !DEFAULT_CATEGORIES.includes(c)),
        ];
        return merged;
      }
    } catch {}
    return DEFAULT_CATEGORIES;
  });

  const addCategory = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    setCategories(prev => {
      if (prev.some(c => c === trimmed)) return prev;
      const updated = [...prev, trimmed];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    return true;
  }, []);

  return { categories, addCategory };
}
