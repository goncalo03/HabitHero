import EmptyState from "@/components/EmptyState";
import HabitCard from "@/components/HabitCard";
import ScaledScreen from "@/components/ScaledScreen";
import { isCompletedToday } from "@/constants/habitUtils";
import { useHabits } from "@/context/HabitContext";
import { useTheme } from "@/hooks/useTheme";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function HomeScreen() {
  const { habits, loading } = useHabits();
  const { theme } = useTheme();

  const { completed, percentage } = useMemo(() => {
    const completed = habits.filter(isCompletedToday).length;
    const percentage =
      habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0;
    return { completed, percentage };
  }, [habits]);

  const today = new Date().toLocaleDateString("pt-PT", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScaledScreen>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>
              {today}
            </Text>
            <Text style={[styles.title, { color: theme.text }]}>
              Os meus Hábitos
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: theme.primary }]}
            onPress={() => router.push("/modal")}
          >
            <Text style={styles.addBtnText}>+ Adicionar</Text>
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        {habits.length > 0 && (
          <View
            style={[styles.progressCard, { backgroundColor: theme.surface }]}
          >
            <View style={styles.progressHeader}>
              <Text style={[styles.progressLabel, { color: theme.text }]}>
                {completed}/{habits.length} concluídos hoje
              </Text>
              <Text style={[styles.progressPct, { color: theme.primary }]}>
                {percentage}%
              </Text>
            </View>
            <View
              style={[
                styles.progressBg,
                { backgroundColor: theme.surfaceVariant },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: theme.primary, width: `${percentage}%` },
                ]}
              />
            </View>
            {completed === habits.length && habits.length > 0 && (
              <Text style={[styles.allDone, { color: theme.success }]}>
                🎉 Todos os hábitos completos!
              </Text>
            )}
          </View>
        )}

        {/* List */}
        {loading ? null : habits.length === 0 ? (
          <EmptyState
            emoji="🌱"
            title="Ainda sem hábitos"
            subtitle="Toca em '+ Adicionar' para criar o teu primeiro hábito!"
          />
        ) : (
          <FlatList
            data={habits}
            keyExtractor={(h) => h.id}
            renderItem={({ item }) => <HabitCard habit={item} />}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScaledScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: { fontSize: 13, marginBottom: 2 },
  title: { fontSize: 26, fontWeight: "800" },
  addBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  progressCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  progressHeader: { flexDirection: "row", justifyContent: "space-between" },
  progressLabel: { fontSize: 14, fontWeight: "500" },
  progressPct: { fontSize: 14, fontWeight: "700" },
  progressBg: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  allDone: { fontSize: 13, fontWeight: "600", textAlign: "center" },
  list: { paddingBottom: 24, paddingTop: 4 },
});
