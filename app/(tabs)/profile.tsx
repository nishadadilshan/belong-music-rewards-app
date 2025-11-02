import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { ThemeToggle } from '../../src/components/ui/ThemeToggle';
import { useUserStore } from '../../src/stores/userStore';
import { useChallenges } from '../../src/hooks/useChallenges';
import { useTheme } from '../../src/hooks/useTheme';

export default function ProfileScreen() {
  const { totalPoints, completedChallenges } = useUserStore();
  const { challenges } = useChallenges();
  const { colors, spacing } = useTheme();

  const completedChallengesData = challenges.filter((c) =>
    completedChallenges.includes(c.id)
  );

  const totalPointsEarned = completedChallengesData.reduce(
    (sum, challenge) => sum + challenge.points,
    0
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>Profile</Text>
        </View>

        <ThemeToggle style={{ marginBottom: spacing.md }} />

        <GlassCard style={styles.statsCard}>
          <View style={styles.statsContent}>
            <Text style={[styles.statsLabel, { color: colors.text.secondary }]}>Total Points</Text>
            <Text style={[styles.statsValue, { color: colors.text.primary }]}>{totalPoints}</Text>
          </View>
        </GlassCard>

        <GlassCard style={styles.statsCard}>
          <View style={styles.statsContent}>
            <Text style={[styles.statsLabel, { color: colors.text.secondary }]}>Completed Challenges</Text>
            <Text style={[styles.statsValue, { color: colors.text.primary }]}>
              {completedChallenges.length} / {challenges.length}
            </Text>
          </View>
        </GlassCard>

        {completedChallengesData.length > 0 && (
          <View style={styles.completedSection}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Completed Challenges</Text>
            {completedChallengesData.map((challenge) => (
              <GlassCard key={challenge.id} style={styles.challengeCard}>
                <View style={styles.challengeContent}>
                  <View>
                    <Text style={[styles.challengeTitle, { color: colors.text.primary }]}>{challenge.title}</Text>
                    <Text style={[styles.challengeArtist, { color: colors.text.secondary }]}>{challenge.artist}</Text>
                  </View>
                  <Text style={[styles.challengePoints, { color: colors.accent }]}>+{challenge.points} pts</Text>
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
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'System',
    letterSpacing: -0.5,
  },
  statsCard: {
    padding: 24,
    marginBottom: 16,
  },
  statsContent: {
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: 14,
    fontFamily: 'System',
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  completedSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'System',
    marginBottom: 16,
  },
  challengeCard: {
    padding: 16,
    marginBottom: 8,
  },
  challengeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
    marginBottom: 4,
  },
  challengeArtist: {
    fontSize: 14,
    fontFamily: 'System',
  },
  challengePoints: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
});

