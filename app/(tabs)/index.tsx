import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChallengeList } from '../../src/components/challenge/ChallengeList';
import { useChallenges } from '../../src/hooks/useChallenges';
import { useMusicPlayer } from '../../src/hooks/useMusicPlayer';
import { THEME } from '../../src/constants/theme';
import { MusicChallenge } from '../../src/types';

export default function HomeScreen() {
  const router = useRouter();
  const { challenges, loading, refreshChallenges } = useChallenges();
  const { play } = useMusicPlayer();

  useEffect(() => {
    refreshChallenges();
  }, []);

  const handleChallengePress = (challenge: MusicChallenge) => {
    router.push({
      pathname: '/(modals)/challenge-detail',
      params: { challengeId: challenge.id },
    });
  };

  const handleChallengePlay = async (challenge: MusicChallenge) => {
    await play(challenge);
    router.push('/(modals)/player');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Music Rewards</Text>
        <Text style={styles.subtitle}>Complete challenges to earn points</Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading challenges...</Text>
        </View>
      ) : (
        <ChallengeList
          challenges={challenges}
          onChallengePress={handleChallengePress}
          onChallengePlay={handleChallengePlay}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    padding: THEME.spacing.lg,
    paddingBottom: THEME.spacing.md,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    fontFamily: THEME.fonts.bold,
    marginBottom: THEME.spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: THEME.colors.text.secondary,
    fontFamily: THEME.fonts.regular,
    marginTop: THEME.spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: THEME.colors.text.secondary,
    fontSize: 16,
  },
});

