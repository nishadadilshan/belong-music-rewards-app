import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../hooks/useTheme';

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
  const { colors, shadows, borderRadius, isDark, spacing } = useTheme();

  const getGradientColors = () => {
    if (disabled) {
      return isDark 
        ? ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']
        : ['rgba(0, 0, 0, 0.04)', 'rgba(0, 0, 0, 0.02)'];
    }
    switch (variant) {
      case 'primary':
        return colors.gradients.primary;
      case 'secondary':
        return colors.gradients.secondary;
      case 'accent':
        return colors.gradients.accent;
      default:
        return colors.gradients.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.text.tertiary;
    // For buttons with gradients, use white text for better contrast
    return '#FFFFFF';
  };
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[style, disabled && styles.disabled]}
    >
      <View style={[
        styles.buttonContainer, 
        shadows.sm,
        {
          borderRadius: borderRadius.md,
          borderColor: colors.border,
        }
      ]}>
        <BlurView
          intensity={disabled ? 10 : 20}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFillObject}
        />
        <LinearGradient
          colors={getGradientColors() as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={[
          styles.buttonContent,
          {
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
          }
        ]}>
          {loading ? (
            <ActivityIndicator color={getTextColor()} size="small" />
          ) : (
            <Text style={[
              styles.buttonText, 
              { 
                color: getTextColor(),
                fontFamily: 'System',
              }
            ]}>
              {title}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    overflow: 'hidden',
    borderWidth: 1,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  disabled: {
    opacity: 0.5,
  },
});

