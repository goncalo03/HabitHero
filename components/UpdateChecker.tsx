import { useTheme } from "@/hooks/useTheme";
import Constants from "expo-constants";
import * as Updates from "expo-updates";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function UpdateChecker() {
  const { theme } = useTheme();
  const [checking, setChecking] = useState(false);

  const appVersion = Constants.expoConfig?.version ?? "1.0.0";
  const updateId = Updates.updateId
    ? Updates.updateId.slice(0, 8) + "..."
    : "build local";
  const channel = Updates.channel ?? "—";
  const isEnabled = Updates.isEnabled;

  const handleCheckUpdate = async () => {
    if (!isEnabled) {
      Alert.alert(
        "Updates desativados",
        "As atualizações automáticas só funcionam em builds produção (APK/AAB). No modo de desenvolvimento não estão ativas."
      );
      return;
    }

    setChecking(true);
    try {
      const result = await Updates.checkForUpdateAsync();
      if (result.isAvailable) {
        Alert.alert(
          "🎉 Update disponível!",
          "Uma nova versão está disponível. Descarregar e aplicar agora?",
          [
            { text: "Depois", style: "cancel" },
            {
              text: "Aplicar",
              onPress: async () => {
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
              },
            },
          ]
        );
      } else {
        Alert.alert("✅ Versão atual", "Já tens a versão mais recente instalada!");
      }
    } catch (e) {
      Alert.alert("Erro", "Não foi possível verificar atualizações.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <Text style={[styles.title, { color: theme.text }]}>ℹ️ Informação da App</Text>

      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Versão</Text>
        <Text style={[styles.value, { color: theme.text }]}>{appVersion}</Text>
      </View>

      <View style={[styles.row, { borderTopColor: theme.border, borderTopWidth: 1 }]}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Update ID</Text>
        <Text style={[styles.value, { color: theme.text }]}>{updateId}</Text>
      </View>

      <View style={[styles.row, { borderTopColor: theme.border, borderTopWidth: 1 }]}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Canal</Text>
        <Text style={[styles.value, { color: theme.text }]}>{channel}</Text>
      </View>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: theme.primary }]}
        onPress={handleCheckUpdate}
        disabled={checking}
      >
        {checking ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.btnText}>Verificar Atualizações</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  title: { fontSize: 17, fontWeight: "700", marginBottom: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  label: { fontSize: 14 },
  value: { fontSize: 14, fontWeight: "600" },
  btn: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
