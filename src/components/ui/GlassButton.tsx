import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { THEME } from '../../constants/theme';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary' | 'accent';
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  variant = 'primary',
}) => {
  const getGradientColors = () => {
    if (disabled) {
      return ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'];
    }
    switch (variant) {
      case 'primary':
        return THEME.colors.gradients.primary;
      case 'secondary':
        return THEME.colors.gradients.secondary;
      case 'accent':
        return THEME.colors.gradients.accent;
      default:
        return THEME.colors.gradients.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return THEME.colors.text.tertiary;
    return THEME.colors.text.primary;
  };
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[style, disabled && styles.disabled]}
    >
      <View style={[styles.buttonContainer, THEME.shadows.sm]}>
        <BlurView
          intensity={disabled ? 10 : 20}
          tint="dark"
          style={StyleSheet.absoluteFillObject}
        />
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.buttonContent}>
          {loading ? (
            <ActivityIndicator color={getTextColor()} size="small" />
          ) : (
            <Text style={[styles.buttonText, { color: getTextColor() }]}>{title}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: THEME.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  buttonContent: {
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: THEME.fonts.bold,
    letterSpacing: 0.5,
  },
  disabled: {
    opacity: 0.5,
  },
});

