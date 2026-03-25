import { Stack } from 'expo-router';
import { HabitProvider } from '@/context/HabitContext';
import { useTheme } from '@/hooks/useTheme';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const { isDark, theme } = useTheme();

  return (
    <HabitProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </HabitProvider>
  );
}
