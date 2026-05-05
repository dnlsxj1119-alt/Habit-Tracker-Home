export type Routine = {
  id: string;
  name: string;
  category: string;
  goal: string;
  memo: string;
  createdAt: string;  // ISO date string
  completedDates: string[];  // Array of date strings like "2026-05-03"
};

export const CATEGORIES = [
  "건강",
  "운동",
  "학습",
  "마음",
  "생활",
  "기타",
] as const;
