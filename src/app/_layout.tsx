import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setupTrackPlayer } from '../services/audioService';
import { useMusicStore } from '../stores/musicStore';

export default function RootLayout() {
  const { loadChallenges } = useMusicStore();

  useEffect(() => {
    setupTrackPlayer().catch((error) => {
      console.error('Failed to setup TrackPlayer:', error);
    });
    loadChallenges();
  }, [loadChallenges]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
    </GestureHandlerRootView>
  );
}


