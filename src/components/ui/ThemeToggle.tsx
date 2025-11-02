import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { useTheme } from '../../hooks/useTheme';
import { GlassCard } from './GlassCard';

interface ThemeToggleProps {
  style?: ViewStyle;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ style }) => {
  const { theme, colors, spacing, borderRadius } = useTheme();
  const { themeMode, toggleTheme } = useThemeStore();

  return (
    <GlassCard style={[styles.container, style]}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: colors.text.primary }]}>
            Theme
          </Text>
          <Text style={[styles.subLabel, { color: colors.text.secondary }]}>
            {themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={toggleTheme}
          activeOpacity={0.7}
          style={[
            styles.toggleButton,
            {
              backgroundColor: colors.primary,
              borderRadius: borderRadius.full,
            },
          ]}
        >
          <View
            style={[
              styles.toggleCircle,
              themeMode === 'light' && styles.toggleCircleLight,
              {
                backgroundColor: colors.backgroundSecondary,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subLabel: {
    fontSize: 14,
  },
  toggleButton: {
    width: 56,
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  toggleCircleLight: {
    alignSelf: 'flex-end',
  },
});
