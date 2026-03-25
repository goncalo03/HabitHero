import { darkTheme, lightTheme, Theme } from "@/constants/Colors";
import { useColorScheme } from "react-native";

export const useTheme = (): { theme: Theme; isDark: boolean } => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return { theme: isDark ? darkTheme : lightTheme, isDark };
};
