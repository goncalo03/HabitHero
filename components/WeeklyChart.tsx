import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  data: number[];
  maxValue: number;
  color: string;
}

const DAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function WeeklyChart({ data, maxValue, color }: Props) {
  const { theme } = useTheme();
  const todayIndex = (new Date().getDay() + 6) % 7; // Mon=0
  const paddedData = data.length === 7 ? data : Array(7).fill(0);

  return (
    <View style={styles.container}>
      <View style={styles.barsRow}>
        {paddedData.map((val, i) => {
          const ratio = maxValue > 0 ? val / maxValue : 0;
          const isToday = i === todayIndex;
          return (
            <View key={i} style={styles.barWrapper}>
              <Text style={[styles.value, { color: theme.textSecondary }]}>
                {val > 0 ? val : ""}
              </Text>
              <View
                style={[
                  styles.barBg,
                  { backgroundColor: theme.surfaceVariant },
                ]}
              >
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${Math.max(ratio * 100, 4)}%`,
                      backgroundColor: isToday ? color : color + "80",
                      borderRadius: 4,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  {
                    color: isToday ? color : theme.textSecondary,
                    fontWeight: isToday ? "700" : "400",
                  },
                ]}
              >
                {DAY_LABELS[i]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 8 },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 120,
    gap: 6,
  },
  barWrapper: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
    gap: 4,
  },
  value: { fontSize: 10, height: 14 },
  barBg: {
    width: "100%",
    flex: 1,
    borderRadius: 4,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: { width: "100%" },
  label: { fontSize: 11 },
});
