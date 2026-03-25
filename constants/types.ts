export interface Habit {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  completedDates: string[]; // ISO date strings YYYY-MM-DD
  color: string;
  icon: string;
}

export interface HabitStats {
  totalCompletedDays: number;
  longestStreak: number;
  currentStreak: number;
  weeklyCompletions: number[]; // last 7 days [Mon..Sun]
}
