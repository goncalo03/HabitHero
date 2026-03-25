import ScaledScreen from "@/components/ScaledScreen";
import { HABIT_COLORS, HABIT_ICONS } from "@/constants/habitUtils";
import { useHabits } from "@/context/HabitContext";
import { useTheme } from "@/hooks/useTheme";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ModalScreen() {
  const { addHabit } = useHabits();
  const { theme } = useTheme();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(HABIT_ICONS[0]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Atenção", "Por favor escreve o nome do hábito.");
      return;
    }
    await addHabit(
      name.trim(),
      description.trim() || undefined,
      selectedColor,
      selectedIcon,
    );
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScaledScreen>
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backBtn}
              >
                <Text style={[styles.backText, { color: theme.primary }]}>
                  ← Voltar
                </Text>
              </TouchableOpacity>
              <Text style={[styles.title, { color: theme.text }]}>
                Novo Hábito
              </Text>
              <View style={{ width: 70 }} />
            </View>

            {/* Preview */}
            <View
              style={[
                styles.previewCard,
                {
                  backgroundColor: selectedColor + "20",
                  borderColor: selectedColor + "40",
                },
              ]}
            >
              <Text style={styles.previewIcon}>{selectedIcon}</Text>
              <Text style={[styles.previewName, { color: theme.text }]}>
                {name || "Pré-visualização"}
              </Text>
              {description ? (
                <Text
                  style={[styles.previewDesc, { color: theme.textSecondary }]}
                >
                  {description}
                </Text>
              ) : null}
            </View>

            {/* Name */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                NOME DO HÁBITO *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="ex: Correr de manhã"
                placeholderTextColor={theme.textSecondary}
                value={name}
                onChangeText={setName}
                maxLength={40}
              />
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                DESCRIÇÃO (opcional)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Adiciona uma pequena descrição..."
                placeholderTextColor={theme.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                maxLength={120}
              />
            </View>

            {/* Icon picker */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                ESCOLHE UM ÍCONE
              </Text>
              <View style={styles.iconGrid}>
                {HABIT_ICONS.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[
                      styles.iconBtn,
                      {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                      },
                      selectedIcon === icon && {
                        borderColor: selectedColor,
                        backgroundColor: selectedColor + "20",
                      },
                    ]}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <Text style={styles.iconEmoji}>{icon}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Color picker */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                ESCOLHE UMA COR
              </Text>
              <View style={styles.colorRow}>
                {HABIT_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Text style={styles.colorCheck}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Save */}
            <TouchableOpacity
              style={[
                styles.saveBtn,
                {
                  backgroundColor: selectedColor,
                  opacity: name.trim() ? 1 : 0.5,
                },
              ]}
              onPress={handleSave}
            >
              <Text style={styles.saveBtnText}>Guardar Hábito</Text>
            </TouchableOpacity>
          </ScrollView>
        </ScaledScreen>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, gap: 20, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backBtn: { paddingVertical: 4 },
  backText: { fontSize: 15, fontWeight: "600" },
  title: { fontSize: 20, fontWeight: "800" },
  previewCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1.5,
    gap: 6,
  },
  previewIcon: { fontSize: 40 },
  previewName: { fontSize: 18, fontWeight: "700" },
  previewDesc: { fontSize: 13 },
  section: { gap: 8 },
  label: { fontSize: 11, fontWeight: "700", letterSpacing: 0.8 },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    fontSize: 15,
  },
  textArea: { minHeight: 80, textAlignVertical: "top" },
  iconGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  iconBtn: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  iconEmoji: { fontSize: 24 },
  colorRow: { flexDirection: "row", gap: 10 },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  colorSelected: {
    transform: [{ scale: 1.2 }],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  colorCheck: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  saveBtn: {
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
