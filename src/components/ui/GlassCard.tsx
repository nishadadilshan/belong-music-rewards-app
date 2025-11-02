import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';

interface GlassCardProps {
  children: React.ReactNode;
  blurIntensity?: number;
  borderRadius?: number;
  style?: ViewStyle;
  gradientColors?: readonly string[];
  variant?: 'default' | 'elevated' | 'subtle';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  blurIntensity = 25,
  borderRadius,
  gradientColors,
  style,
  variant = 'default',
}) => {
  const { colors, borderRadius: themeBorderRadius, shadows, isDark } = useTheme();
  const cardBorderRadius = borderRadius ?? themeBorderRadius.md;
  
  const getGradientColors = (): string[] => {
    if (gradientColors) return [...gradientColors];
    
    switch (variant) {
      case 'elevated':
        return isDark 
          ? ['rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.10)', 'rgba(255, 255, 255, 0.08)']
          : ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.90)', 'rgba(255, 255, 255, 0.85)'];
      case 'subtle':
        return isDark
          ? ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)']
          : ['rgba(255, 255, 255, 0.85)', 'rgba(255, 255, 255, 0.75)'];
      default:
        return isDark
          ? ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.05)']
          : ['rgba(255, 255, 255, 0.90)', 'rgba(255, 255, 255, 0.85)', 'rgba(255, 255, 255, 0.80)'];
    }
  };

  const getShadowStyle = () => {
    if (variant === 'elevated') {
      return {
        ...shadows.md,
        shadowColor: colors.primary,
        shadowOpacity: 0.2,
      };
    }
    return shadows.sm;
  };

  return (
    <View style={[{ borderRadius: cardBorderRadius, overflow: 'hidden' }, getShadowStyle(), style]}>
      <BlurView
        intensity={blurIntensity}
        tint={isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFillObject}
      />
      <LinearGradient
        colors={getGradientColors() as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={[StyleSheet.absoluteFillObject, {
        borderRadius: cardBorderRadius,
        borderWidth: 1,
        borderColor: colors.border,
      }]} />
      <View style={{ padding: 1, borderRadius: cardBorderRadius - 1, overflow: 'hidden' }}>
        {children}
      </View>
    </View>
  );
};

