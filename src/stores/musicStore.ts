import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MusicChallenge } from '../types';

interface MusicStore {
  challenges: MusicChallenge[];
  currentTrack: MusicChallenge | null;
  isPlaying: boolean;
  currentPosition: number;
  playbackSpeed: number;
  loadChallenges: () => void;
  setCurrentTrack: (track: MusicChallenge | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentPosition: (position: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  updateProgress: (challengeId: string, progress: number) => void;
  markChallengeComplete: (challengeId: string) => void;
}

export const useMusicStore = create<MusicStore>()(
  persist(
    (set, get) => ({
      challenges: [],
      currentTrack: null,
      isPlaying: false,
      currentPosition: 0,
      playbackSpeed: 1.0,
      loadChallenges: () => {
        const { SAMPLE_CHALLENGES } = require('../constants/challenges');
        set({ challenges: SAMPLE_CHALLENGES });
      },
      setCurrentTrack: (track) => set({ currentTrack: track }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setCurrentPosition: (position) => set({ currentPosition: position }),
      setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
      updateProgress: (challengeId: string, progress: number) => {
        const { challenges } = get();
        const updatedChallenges = challenges.map((challenge) =>
          challenge.id === challengeId
            ? { ...challenge, progress: Math.min(100, Math.max(0, progress)) }
            : challenge
        );
        set({ challenges: updatedChallenges });
      },
      markChallengeComplete: (challengeId: string) => {
        const { challenges } = get();
        const updatedChallenges = challenges.map((challenge) =>
          challenge.id === challengeId
            ? {
                ...challenge,
                completed: true,
                progress: 100,
                completedAt: new Date().toISOString(),
              }
            : challenge
        );
        set({ challenges: updatedChallenges });
      },
    }),
    {
      name: 'music-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        challenges: state.challenges,
        playbackSpeed: state.playbackSpeed, // Persist playback speed
        currentTrack: null, // Don't persist current track
        isPlaying: false, // Don't persist playing state
        currentPosition: 0, // Don't persist position
      }),
    }
  )
);

