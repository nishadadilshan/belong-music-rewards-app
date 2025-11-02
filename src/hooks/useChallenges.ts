import { useEffect, useState } from 'react';
import { useMusicStore } from '../stores/musicStore';
import { useUserStore } from '../stores/userStore';
import { MusicChallenge } from '../types';

interface UseChallengesReturn {
  challenges: MusicChallenge[];
  completedChallenges: string[];
  loading: boolean;
  error: string | null;
  refreshChallenges: () => Promise<void>;
  completeChallenge: (challengeId: string) => Promise<void>;
}

export const useChallenges = (): UseChallengesReturn => {
  const {
    challenges,
    loadChallenges,
    markChallengeComplete,
  } = useMusicStore();
  const { completedChallenges, completeChallenge: addCompletedChallenge } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  const refreshChallenges = async () => {
    try {
      setLoading(true);
      setError(null);
      loadChallenges();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh challenges');
    } finally {
      setLoading(false);
    }
  };

  const completeChallenge = async (challengeId: string) => {
    try {
      setLoading(true);
      setError(null);
      markChallengeComplete(challengeId);
      addCompletedChallenge(challengeId);
      
      const challenge = challenges.find((c) => c.id === challengeId);
      if (challenge) {
        useUserStore.getState().addPoints(challenge.points);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete challenge');
    } finally {
      setLoading(false);
    }
  };

  return {
    challenges,
    completedChallenges,
    loading,
    error,
    refreshChallenges,
    completeChallenge,
  };
};

