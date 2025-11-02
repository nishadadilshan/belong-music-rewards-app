import { useThemeStore, ThemeMode } from '../stores/themeStore';
import { DARK_THEME, LIGHT_THEME } from '../constants/theme';

export const useTheme = () => {
  const themeMode = useThemeStore((state) => state.themeMode);
  const theme = themeMode === 'dark' ? DARK_THEME : LIGHT_THEME;
  const isDark = themeMode === 'dark';
  const isLight = themeMode === 'light';

  return {
    theme,
    themeMode,
    isDark,
    isLight,
    colors: theme.colors,
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
    shadows: theme.shadows,
    fonts: theme.fonts,
  };
};
