import { Habit, HabitStats } from './types';

export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const isCompletedToday = (habit: Habit): boolean => {
  return habit.completedDates.includes(getTodayString());
};

export const calculateStreak = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0;

  const sorted = [...completedDates].sort((a, b) => b.localeCompare(a));
  const today = getTodayString();
  const yesterday = getDateString(new Date(Date.now() - 86400000));

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = Math.round((prev.getTime() - curr.getTime()) / 86400000);
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

export const calculateLongestStreak = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0;

  const sorted = [...completedDates].sort((a, b) => a.localeCompare(b));
  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86400000);
    if (diffDays === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
};

export const getWeeklyCompletions = (habits: Habit[]): number[] => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return getDateString(d);
  });

  return days.map(day =>
    habits.filter(h => h.completedDates.includes(day)).length
  );
};

export const computeStats = (habits: Habit[]): HabitStats => {
  const allDates = habits.flatMap(h => h.completedDates);
  const uniqueDates = [...new Set(allDates)];

  return {
    totalCompletedDays: uniqueDates.length,
    longestStreak: Math.max(0, ...habits.map(h => calculateLongestStreak(h.completedDates))),
    currentStreak: Math.max(0, ...habits.map(h => calculateStreak(h.completedDates))),
    weeklyCompletions: getWeeklyCompletions(habits),
  };
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};

export const HABIT_COLORS = [
  '#6C63FF', '#FF6584', '#43C59E', '#FFB347',
  '#4FC3F7', '#FF8A65', '#A29BFE', '#55EFC4',
];

export const HABIT_ICONS = ['⚡', '💪', '📚', '🧘', '🏃', '💧', '🥗', '😴', '🎯', '✍️'];
