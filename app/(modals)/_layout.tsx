import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
      }}
    >
      <Stack.Screen name="player" />
      <Stack.Screen name="challenge-detail" />
    </Stack>
  );
}

