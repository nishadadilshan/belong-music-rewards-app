import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from './GlassCard';
import { THEME } from '../../constants/theme';

interface PointsCounterProps {
  currentPoints: number;
  targetPoints: number;
  progress: number; // 0-100
}

export const PointsCounter: React.FC<PointsCounterProps> = ({
  currentPoints,
  targetPoints,
  progress,
}) => {
  return (
    <GlassCard style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pointsLabel}>Points Earned</Text>
        <Text style={styles.pointsValue}>
          {currentPoints} / {targetPoints}
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: THEME.spacing.md,
    marginVertical: THEME.spacing.sm,
  },
  content: {
    alignItems: 'center',
  },
  pointsLabel: {
    color: THEME.colors.text.secondary,
    fontSize: 12,
    fontFamily: THEME.fonts.regular,
    marginBottom: THEME.spacing.xs,
  },
  pointsValue: {
    color: THEME.colors.text.primary,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: THEME.fonts.bold,
    marginBottom: THEME.spacing.sm,
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: THEME.colors.secondary,
    borderRadius: 2,
  },
});

