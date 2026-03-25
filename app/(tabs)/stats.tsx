import EmptyState from "@/components/EmptyState";
import ScaledScreen from "@/components/ScaledScreen";
import StatCard from "@/components/StatCard";
import UpdateChecker from "@/components/UpdateChecker";
import WeeklyChart from "@/components/WeeklyChart";
import {
    calculateStreak,
    computeStats,
    isCompletedToday,
} from "@/constants/habitUtils";
import { useHabits } from "@/context/HabitContext";
import { useTheme } from "@/hooks/useTheme";
import React, { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function StatsScreen() {
  const { habits } = useHabits();
  const { theme } = useTheme();

  const stats = useMemo(() => computeStats(habits), [habits]);

  const topStreakHabits = useMemo(
    () =>
      [...habits]
        .map((h) => ({ ...h, streak: calculateStreak(h.completedDates) }))
        .filter((h) => h.streak > 0)
        .sort((a, b) => b.streak - a.streak)
        .slice(0, 5),
    [habits],
  );

  const completedToday = habits.filter(isCompletedToday).length;

  if (habits.length === 0) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: theme.background }]}
      >
        <EmptyState
          emoji="📊"
          title="Sem estatísticas ainda"
          subtitle="Adiciona hábitos e começa a fazer tracking para ver o teu progresso!"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScaledScreen>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: theme.text }]}>
            O Teu Progresso
          </Text>

          {/* Stat cards */}
          <View style={styles.statsRow}>
            <StatCard
              label="Streak Atual"
              value={`${stats.currentStreak}d`}
              icon="🔥"
              color="#FF6584"
            />
            <StatCard
              label="Melhor Streak"
              value={`${stats.longestStreak}d`}
              icon="🏆"
              color="#FFB347"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              label="Total de Dias"
              value={stats.totalCompletedDays}
              icon="✅"
              color="#43C59E"
            />
            <StatCard
              label="Hoje"
              value={`${completedToday}/${habits.length}`}
              icon="⚡"
              color="#6C63FF"
            />
          </View>

          {/* Weekly chart */}
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Esta Semana
            </Text>
            <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
              Hábitos completos por dia
            </Text>
            <WeeklyChart
              data={stats.weeklyCompletions}
              maxValue={Math.max(habits.length, 1)}
              color="#6C63FF"
            />
          </View>

          {/* Top streaks */}
          {topStreakHabits.length > 0 && (
            <View style={[styles.card, { backgroundColor: theme.surface }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                🔥 Streaks Ativos
              </Text>
              {topStreakHabits.map((habit, idx) => (
                <View
                  key={habit.id}
                  style={[
                    styles.streakRow,
                    {
                      borderTopColor: theme.border,
                      borderTopWidth: idx > 0 ? 1 : 0,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.streakIconBg,
                      { backgroundColor: habit.color + "20" },
                    ]}
                  >
                    <Text style={styles.streakIcon}>{habit.icon}</Text>
                  </View>
                  <Text
                    style={[styles.streakName, { color: theme.text }]}
                    numberOfLines={1}
                  >
                    {habit.name}
                  </Text>
                  <View style={styles.streakBadge}>
                    <Text style={styles.streakFire}>🔥</Text>
                    <Text style={[styles.streakDays, { color: habit.color }]}>
                      {habit.streak}d
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
          <UpdateChecker />
        </ScrollView>
      </ScaledScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, gap: 14, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 4 },
  statsRow: { flexDirection: "row", gap: 12 },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    gap: 4,
  },
  cardTitle: { fontSize: 17, fontWeight: "700" },
  cardSubtitle: { fontSize: 12, marginBottom: 8 },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },
  streakIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  streakIcon: { fontSize: 18 },
  streakName: { flex: 1, fontSize: 14, fontWeight: "500" },
  streakBadge: { flexDirection: "row", alignItems: "center", gap: 3 },
  streakFire: { fontSize: 13 },
  streakDays: { fontSize: 15, fontWeight: "700" },
});
