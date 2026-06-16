export type Routine = {
  id: string;
  name: string;
  category: string;
  goal: string;
  memo: string;
  createdAt: string;  // ISO date string
  completedDates: string[];  // Array of date strings like "2026-05-03"
  subOptions?: string[]; // Array of sub-option strings
  subOptionType?: "single" | "multi"; // Selection type
  completedDetails?: Record<string, string | string[]>; // Maps date string to selected sub-option(s)
  type?: "habit" | "gratitude"; // Habit or Gratitude Journal
};

export const CATEGORIES = [
  "건강",
  "운동",
  "학습",
  "마음",
  "생활",
  "기타",
] as const;
