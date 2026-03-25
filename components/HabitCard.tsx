import { calculateStreak, isCompletedToday } from "@/constants/habitUtils";
import { Habit } from "@/constants/types";
import { useHabits } from "@/context/HabitContext";
import { useTheme } from "@/hooks/useTheme";
import React, { useRef } from "react";
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  habit: Habit;
}

export default function HabitCard({ habit }: Props) {
  const { theme } = useTheme();
  const { toggleHabit, deleteHabit } = useHabits();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const completed = isCompletedToday(habit);
  const streak = calculateStreak(habit.completedDates);

  const handleToggle = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
    toggleHabit(habit.id);
  };

  const handleLongPress = () => {
    Alert.alert(habit.name, "O que queres fazer?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteHabit(habit.id),
      },
    ]);
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: theme.surface,
            borderColor: completed ? habit.color + "60" : theme.border,
            shadowColor: theme.shadow,
          },
          completed && { borderWidth: 1.5 },
        ]}
        onPress={handleToggle}
        onLongPress={handleLongPress}
        activeOpacity={0.85}
      >
        <View style={[styles.accentBar, { backgroundColor: habit.color }]} />
        <View style={styles.content}>
          <View style={styles.left}>
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: habit.color + "20" },
              ]}
            >
              <Text style={styles.icon}>{habit.icon}</Text>
            </View>
            <View style={styles.textBlock}>
              <Text
                style={[
                  styles.name,
                  { color: theme.text },
                  completed && styles.completedText,
                ]}
              >
                {habit.name}
              </Text>
              {habit.description ? (
                <Text
                  style={[styles.desc, { color: theme.textSecondary }]}
                  numberOfLines={1}
                >
                  {habit.description}
                </Text>
              ) : null}
              {streak > 0 && (
                <View style={styles.streakRow}>
                  <Text style={styles.fire}>🔥</Text>
                  <Text style={[styles.streakText, { color: habit.color }]}>
                    {streak} {streak === 1 ? "dia" : "dias"} seguidos
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View
            style={[
              styles.checkbox,
              {
                borderColor: completed ? habit.color : theme.border,
                backgroundColor: completed ? habit.color : "transparent",
              },
            ]}
          >
            {completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
    flexDirection: "row",
  },
  accentBar: { width: 4 },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    justifyContent: "space-between",
  },
  left: { flexDirection: "row", alignItems: "center", flex: 1, gap: 12 },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 22 },
  textBlock: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
  completedText: { opacity: 0.5, textDecorationLine: "line-through" },
  desc: { fontSize: 12, marginBottom: 4 },
  streakRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  fire: { fontSize: 11 },
  streakText: { fontSize: 11, fontWeight: "600" },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  checkmark: { color: "#fff", fontSize: 14, fontWeight: "bold" },
});
