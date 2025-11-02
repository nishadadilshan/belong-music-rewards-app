import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { GlassButton } from '../../src/components/ui/GlassButton';
import { useMusicStore } from '../../src/stores/musicStore';
import { useUserStore } from '../../src/stores/userStore';
import { useMusicPlayer } from '../../src/hooks/useMusicPlayer';
import { THEME } from '../../src/constants/theme';

export default function ChallengeDetailScreen() {
  const router = useRouter();
  const { challengeId } = useLocalSearchParams<{ challengeId: string }>();
  const { challenges } = useMusicStore();
  const { completeChallenge } = useUserStore();
  const { play } = useMusicPlayer();

  const challenge = challenges.find((c) => c.id === challengeId);

  if (!challenge) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Challenge not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handlePlay = async () => {
    if (challenge) {
      await play(challenge);
      router.push('/(modals)/player');
    }
  };

  const getDifficultyColor = () => {
    switch (challenge.difficulty) {
      case 'easy':
        return THEME.colors.secondary;
      case 'medium':
        return THEME.colors.accent;
      case 'hard':
        return THEME.colors.error;
      default:
        return THEME.colors.secondary;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <GlassCard style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <View>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengeArtist}>{challenge.artist}</Text>
            </View>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: `${getDifficultyColor()}40` },
              ]}
            >
              <Text
                style={[styles.difficultyText, { color: getDifficultyColor() }]}
              >
                {challenge.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.description}>{challenge.description}</Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Points</Text>
              <Text style={styles.statValue}>{challenge.points}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Duration</Text>
              <Text style={styles.statValue}>{formatDuration(challenge.duration)}</Text>
            </View>
          </View>

          {challenge.progress > 0 && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>Progress: {challenge.progress.toFixed(0)}%</Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${challenge.progress}%` },
                  ]}
                />
              </View>
            </View>
          )}

          {challenge.completed && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓ Completed</Text>
            </View>
          )}
        </GlassCard>

        <GlassButton
          title={challenge.completed ? "Play Again" : "Start Challenge"}
          onPress={handlePlay}
          style={styles.playButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    padding: THEME.spacing.md,
    alignItems: 'flex-end',
  },
  closeButton: {
    color: THEME.colors.text.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: THEME.spacing.lg,
  },
  challengeCard: {
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.md,
  },
  challengeTitle: {
    color: THEME.colors.text.primary,
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: THEME.fonts.bold,
    marginBottom: THEME.spacing.xs,
  },
  challengeArtist: {
    color: THEME.colors.text.secondary,
    fontSize: 18,
    fontFamily: THEME.fonts.regular,
  },
  difficultyBadge: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.sm,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: THEME.fonts.medium,
  },
  description: {
    color: THEME.colors.text.secondary,
    fontSize: 16,
    fontFamily: THEME.fonts.regular,
    marginBottom: THEME.spacing.lg,
    lineHeight: 24,
  },
  stats: {
    flexDirection: 'row',
    gap: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    color: THEME.colors.text.secondary,
    fontSize: 14,
    fontFamily: THEME.fonts.regular,
    marginBottom: THEME.spacing.xs,
  },
  statValue: {
    color: THEME.colors.accent,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: THEME.fonts.bold,
  },
  progressContainer: {
    marginTop: THEME.spacing.md,
  },
  progressLabel: {
    color: THEME.colors.text.secondary,
    fontSize: 14,
    fontFamily: THEME.fonts.regular,
    marginBottom: THEME.spacing.xs,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: THEME.colors.glassDark,
    borderRadius: THEME.borderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: THEME.colors.secondary,
    borderRadius: THEME.borderRadius.full,
    ...THEME.shadows.sm,
  },
  completedBadge: {
    marginTop: THEME.spacing.md,
    padding: THEME.spacing.sm,
    backgroundColor: `${THEME.colors.secondary}40`,
    borderRadius: THEME.borderRadius.sm,
    alignItems: 'center',
  },
  completedText: {
    color: THEME.colors.secondary,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: THEME.fonts.medium,
  },
  playButton: {
    marginTop: 'auto',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: THEME.colors.text.primary,
    fontSize: 18,
  },
  backButton: {
    color: THEME.colors.primary,
    fontSize: 16,
    marginTop: THEME.spacing.md,
  },
});

