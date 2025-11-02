import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { THEME } from '../../constants/theme';
import { MusicChallenge } from '../../types';

interface ChallengeCardProps {
  challenge: MusicChallenge;
  onPress: () => void;
  onPlay: () => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onPress,
  onPlay,
}) => {
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
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <GlassCard style={styles.card}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{challenge.title}</Text>
              <Text style={styles.artist}>{challenge.artist}</Text>
            </View>
            <View style={[styles.difficultyBadge, { backgroundColor: `${getDifficultyColor()}40` }]}>
              <Text style={[styles.difficultyText, { color: getDifficultyColor() }]}>
                {challenge.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <Text style={styles.description}>{challenge.description}</Text>
          
          <View style={styles.footer}>
            <View style={styles.info}>
              <Text style={styles.points}>{challenge.points} pts</Text>
              <Text style={styles.duration}>{formatDuration(challenge.duration)}</Text>
            </View>
            <GlassButton
              title={challenge.completed ? "✓ Completed" : "Play"}
              onPress={onPlay}
              disabled={false}
              style={styles.playButton}
            />
          </View>
          
          {challenge.progress > 0 && !challenge.completed && (
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${challenge.progress}%` }]} />
            </View>
          )}
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: THEME.spacing.md,
    padding: THEME.spacing.lg,
  },
  content: {
    gap: THEME.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    color: THEME.colors.text.primary,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: THEME.fonts.bold,
    marginBottom: THEME.spacing.xs,
  },
  artist: {
    color: THEME.colors.text.secondary,
    fontSize: 14,
    fontFamily: THEME.fonts.regular,
  },
  difficultyBadge: {
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.sm,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: THEME.fonts.medium,
  },
  description: {
    color: THEME.colors.text.secondary,
    fontSize: 14,
    fontFamily: THEME.fonts.regular,
    marginTop: THEME.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: THEME.spacing.sm,
  },
  info: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
    alignItems: 'center',
  },
  points: {
    color: THEME.colors.accent,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: THEME.fonts.medium,
  },
  duration: {
    color: THEME.colors.text.secondary,
    fontSize: 14,
    fontFamily: THEME.fonts.regular,
  },
  playButton: {
    minWidth: 100,
  },
  progressContainer: {
    width: '100%',
    height: 6,
    backgroundColor: THEME.colors.glassDark,
    borderRadius: THEME.borderRadius.full,
    overflow: 'hidden',
    marginTop: THEME.spacing.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: THEME.colors.secondary,
    borderRadius: THEME.borderRadius.full,
    ...THEME.shadows.sm,
  },
});

