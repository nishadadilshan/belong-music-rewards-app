import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { useUserStore } from '../../src/stores/userStore';
import { useChallenges } from '../../src/hooks/useChallenges';
import { THEME } from '../../src/constants/theme';

export default function ProfileScreen() {
  const { totalPoints, completedChallenges } = useUserStore();
  const { challenges } = useChallenges();

  const completedChallengesData = challenges.filter((c) =>
    completedChallenges.includes(c.id)
  );

  const totalPointsEarned = completedChallengesData.reduce(
    (sum, challenge) => sum + challenge.points,
    0
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <GlassCard style={styles.statsCard}>
          <View style={styles.statsContent}>
            <Text style={styles.statsLabel}>Total Points</Text>
            <Text style={styles.statsValue}>{totalPoints}</Text>
          </View>
        </GlassCard>

        <GlassCard style={styles.statsCard}>
          <View style={styles.statsContent}>
            <Text style={styles.statsLabel}>Completed Challenges</Text>
            <Text style={styles.statsValue}>
              {completedChallenges.length} / {challenges.length}
            </Text>
          </View>
        </GlassCard>

        {completedChallengesData.length > 0 && (
          <View style={styles.completedSection}>
            <Text style={styles.sectionTitle}>Completed Challenges</Text>
            {completedChallengesData.map((challenge) => (
              <GlassCard key={challenge.id} style={styles.challengeCard}>
                <View style={styles.challengeContent}>
                  <View>
                    <Text style={styles.challengeTitle}>{challenge.title}</Text>
                    <Text style={styles.challengeArtist}>{challenge.artist}</Text>
                  </View>
                  <Text style={styles.challengePoints}>+{challenge.points} pts</Text>
                </View>
              </GlassCard>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    padding: THEME.spacing.lg,
  },
  header: {
    marginBottom: THEME.spacing.lg,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    fontFamily: THEME.fonts.bold,
    letterSpacing: -0.5,
  },
  statsCard: {
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  statsContent: {
    alignItems: 'center',
  },
  statsLabel: {
    color: THEME.colors.text.secondary,
    fontSize: 14,
    fontFamily: THEME.fonts.regular,
    marginBottom: THEME.spacing.sm,
  },
  statsValue: {
    color: THEME.colors.text.primary,
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: THEME.fonts.bold,
  },
  completedSection: {
    marginTop: THEME.spacing.lg,
  },
  sectionTitle: {
    color: THEME.colors.text.primary,
    fontSize: 20,
    fontWeight: '600',
    fontFamily: THEME.fonts.medium,
    marginBottom: THEME.spacing.md,
  },
  challengeCard: {
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
  },
  challengeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeTitle: {
    color: THEME.colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: THEME.fonts.medium,
    marginBottom: THEME.spacing.xs,
  },
  challengeArtist: {
    color: THEME.colors.text.secondary,
    fontSize: 14,
    fontFamily: THEME.fonts.regular,
  },
  challengePoints: {
    color: THEME.colors.accent,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: THEME.fonts.bold,
  },
});

