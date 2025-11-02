import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../../constants/theme';

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
  borderRadius = THEME.borderRadius.md,
  gradientColors,
  style,
  variant = 'default',
}) => {
  const getGradientColors = () => {
    if (gradientColors) return gradientColors;
    
    switch (variant) {
      case 'elevated':
        return ['rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.10)', 'rgba(255, 255, 255, 0.08)'];
      case 'subtle':
        return ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)'];
      default:
        return ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.05)'];
    }
  };

  const getShadowStyle = () => {
    if (variant === 'elevated') {
      return {
        ...THEME.shadows.md,
        shadowColor: '#8B5CF6',
        shadowOpacity: 0.2,
      };
    }
    return THEME.shadows.sm;
  };

  return (
    <View style={[{ borderRadius, overflow: 'hidden' }, getShadowStyle(), style]}>
      <BlurView
        intensity={blurIntensity}
        tint="dark"
        style={StyleSheet.absoluteFillObject}
      />
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={[StyleSheet.absoluteFillObject, {
        borderRadius,
        borderWidth: 1,
        borderColor: THEME.colors.border,
      }]} />
      <View style={{ padding: 1, borderRadius: borderRadius - 1, overflow: 'hidden' }}>
        {children}
      </View>
    </View>
  );
};

