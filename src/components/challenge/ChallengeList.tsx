import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ChallengeCard } from './ChallengeCard';
import { MusicChallenge } from '../../types';
import { THEME } from '../../constants/theme';

interface ChallengeListProps {
  challenges: MusicChallenge[];
  onChallengePress: (challenge: MusicChallenge) => void;
  onChallengePlay: (challenge: MusicChallenge) => void;
}

export const ChallengeList: React.FC<ChallengeListProps> = ({
  challenges,
  onChallengePress,
  onChallengePlay,
}) => {
  return (
    <FlatList
      data={challenges}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ChallengeCard
          challenge={item}
          onPress={() => onChallengePress(item)}
          onPlay={() => onChallengePlay(item)}
        />
      )}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
      bounces={true}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: THEME.spacing.md,
    paddingBottom: 100, // Extra padding to account for tab bar height (95px) + safe area
  },
});

