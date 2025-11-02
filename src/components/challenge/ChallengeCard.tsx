import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { useTheme } from '../../hooks/useTheme';
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
  const { colors, spacing, borderRadius, fonts, shadows } = useTheme();

  const getDifficultyColor = () => {
    switch (challenge.difficulty) {
      case 'easy':
        return colors.secondary;
      case 'medium':
        return colors.accent;
      case 'hard':
        return colors.error;
      default:
        return colors.secondary;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <GlassCard style={{ marginBottom: spacing.md, padding: spacing.lg }}>
        <View style={[styles.content, { gap: spacing.sm }]}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.text.primary, fontFamily: fonts.bold, marginBottom: spacing.xs }]}>
                {challenge.title}
              </Text>
              <Text style={[styles.artist, { color: colors.text.secondary, fontFamily: fonts.regular }]}>
                {challenge.artist}
              </Text>
            </View>
            <View style={[
              styles.difficultyBadge, 
              { 
                backgroundColor: `${getDifficultyColor()}40`,
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xs,
                borderRadius: borderRadius.sm,
              }
            ]}>
              <Text style={[
                styles.difficultyText, 
                { 
                  color: getDifficultyColor(),
                  fontFamily: fonts.medium,
                }
              ]}>
                {challenge.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <Text style={[
            styles.description, 
            { 
              color: colors.text.secondary, 
              fontFamily: fonts.regular,
              marginTop: spacing.xs,
            }
          ]}>
            {challenge.description}
          </Text>
          
          <View style={[styles.footer, { marginTop: spacing.sm }]}>
            <View style={[styles.info, { gap: spacing.md }]}>
              <Text style={[styles.points, { color: colors.accent, fontFamily: fonts.medium }]}>
                {challenge.points} pts
              </Text>
              <Text style={[styles.duration, { color: colors.text.secondary, fontFamily: fonts.regular }]}>
                {formatDuration(challenge.duration)}
              </Text>
            </View>
            <GlassButton
              title={challenge.completed ? "✓ Completed" : "Play"}
              onPress={onPlay}
              disabled={false}
              style={styles.playButton}
            />
          </View>
          
          {challenge.progress > 0 && !challenge.completed && (
            <View style={[
              styles.progressContainer,
              {
                backgroundColor: colors.glassDark,
                borderRadius: borderRadius.full,
                marginTop: spacing.sm,
              }
            ]}>
              <View style={[
                styles.progressBar, 
                { 
                  width: `${challenge.progress}%`,
                  backgroundColor: colors.secondary,
                  borderRadius: borderRadius.full,
                  ...shadows.sm,
                }
              ]} />
            </View>
          )}
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    // Dynamic styles applied inline
  },
  content: {
    // Dynamic styles applied inline
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 14,
  },
  difficultyBadge: {
    // Dynamic styles applied inline
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {
    fontSize: 16,
    fontWeight: '600',
  },
  duration: {
    fontSize: 14,
  },
  playButton: {
    minWidth: 100,
  },
  progressContainer: {
    width: '100%',
    height: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
});

