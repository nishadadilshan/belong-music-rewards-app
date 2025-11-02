import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserStore {
  totalPoints: number;
  completedChallenges: string[];
  addPoints: (points: number) => void;
  completeChallenge: (challengeId: string) => void;
  reset: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      totalPoints: 0,
      completedChallenges: [],
      addPoints: (points: number) => {
        const { totalPoints } = get();
        set({ totalPoints: totalPoints + points });
      },
      completeChallenge: (challengeId: string) => {
        const { completedChallenges } = get();
        if (!completedChallenges.includes(challengeId)) {
          set({ completedChallenges: [...completedChallenges, challengeId] });
        }
      },
      reset: () => {
        set({ totalPoints: 0, completedChallenges: [] });
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

