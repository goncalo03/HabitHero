import { generateId, getTodayString, HABIT_COLORS, HABIT_ICONS } from '@/constants/habitUtils';
import { Habit } from '@/constants/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = '@habithero_habits';

interface HabitContextType {
  habits: Habit[];
  loading: boolean;
  addHabit: (name: string, description?: string, color?: string, icon?: string) => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  editHabit: (id: string, name: string, description?: string, color?: string, icon?: string) => Promise<void>;
}

const HabitContext = createContext<HabitContextType | null>(null);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) setHabits(JSON.parse(data));
    } catch (e) {
      console.error('Failed to load habits', e);
    } finally {
      setLoading(false);
    }
  };

  const saveHabits = async (updated: Habit[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setHabits(updated);
  };

  const addHabit = useCallback(async (
    name: string,
    description?: string,
    color = HABIT_COLORS[Math.floor(Math.random() * HABIT_COLORS.length)],
    icon = HABIT_ICONS[Math.floor(Math.random() * HABIT_ICONS.length)]
  ) => {
    const newHabit: Habit = {
      id: generateId(),
      name,
      description,
      createdAt: new Date().toISOString(),
      completedDates: [],
      color,
      icon,
    };
    await saveHabits([...habits, newHabit]);
  }, [habits]);

  const toggleHabit = useCallback(async (id: string) => {
    const today = getTodayString();
    const updated = habits.map(h => {
      if (h.id !== id) return h;
      const completedDates = h.completedDates.includes(today)
        ? h.completedDates.filter(d => d !== today)
        : [...h.completedDates, today];
      return { ...h, completedDates };
    });
    await saveHabits(updated);
  }, [habits]);

  const deleteHabit = useCallback(async (id: string) => {
    await saveHabits(habits.filter(h => h.id !== id));
  }, [habits]);

  const editHabit = useCallback(async (
    id: string, name: string, description?: string, color?: string, icon?: string
  ) => {
    const updated = habits.map(h =>
      h.id === id ? { ...h, name, description, color: color ?? h.color, icon: icon ?? h.icon } : h
    );
    await saveHabits(updated);
  }, [habits]);

  return (
    <HabitContext.Provider value={{ habits, loading, addHabit, toggleHabit, deleteHabit, editHabit }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabits must be used within HabitProvider');
  return ctx;
};
