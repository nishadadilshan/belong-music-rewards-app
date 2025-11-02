import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChallengeList } from '../../src/components/challenge/ChallengeList';
import { useChallenges } from '../../src/hooks/useChallenges';
import { useMusicPlayer } from '../../src/hooks/useMusicPlayer';
import { useTheme } from '../../src/hooks/useTheme';
import { MusicChallenge } from '../../src/types';

export default function HomeScreen() {
  const router = useRouter();
  const { challenges, loading, refreshChallenges } = useChallenges();
  const { play } = useMusicPlayer();
  const { colors, spacing, fonts } = useTheme();

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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { padding: spacing.lg, paddingBottom: spacing.md }]}>
        <Text style={[styles.title, { color: colors.text.primary, fontFamily: fonts.bold, marginBottom: spacing.xs }]}>
          Music Rewards
        </Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary, fontFamily: fonts.regular, marginTop: spacing.xs }]}>
          Complete challenges to earn points
        </Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Loading challenges...</Text>
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
  },
  header: {
    // Dynamic styles applied inline
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
});

