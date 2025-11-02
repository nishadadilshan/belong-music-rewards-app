import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'dark' | 'light';

interface ThemeStore {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      themeMode: 'dark' as ThemeMode, // Default to dark theme
      toggleTheme: () =>
        set((state) => ({
          themeMode: state.themeMode === 'dark' ? 'light' : 'dark',
        })),
      setTheme: (mode) => set({ themeMode: mode }),
    }),
    {
      name: 'theme-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Ensure dark is the default even if no persisted value exists
      version: 1,
    }
  )
);
