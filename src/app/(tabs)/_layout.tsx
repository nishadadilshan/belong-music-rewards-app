import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../hooks/useTheme';

const TabIcon = ({ name, focused, colors }: { name: string; focused: boolean; colors: any }) => {
  return (
    <View style={styles.iconContainer}>
      <View style={[
        styles.iconWrapper, 
        focused && [styles.iconWrapperFocused, { backgroundColor: `${colors.primary}25` }]
      ]}>
        <Text style={[styles.icon, focused && styles.iconFocused]}>
          {name === 'home' ? (focused ? '🎵' : '🎧') : (focused ? '👤' : '👤')}
        </Text>
      </View>
    </View>
  );
};

export default function TabsLayout() {
  const { colors, fonts, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, { 
          borderTopColor: colors.border, 
          backgroundColor: colors.background 
        }],
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarLabelStyle: [styles.tabBarLabel, { fontFamily: fonts.medium }],
        tabBarLabelPosition: 'below-icon',
        tabBarItemStyle: styles.tabBarItem,
        tabBarBackground: () => (
          <BlurView
            intensity={30}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFillObject}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} colors={colors} />,
          tabBarButton: (props) => {
            const { onPress, accessibilityState, children, delayLongPress, ...restProps } = props;
            return (
              <TouchableOpacity
                onPress={onPress}
                accessibilityState={accessibilityState}
                activeOpacity={0.7}
                style={styles.tabButtonWrapper}
                {...(restProps as any)}
              >
                {children}
                {accessibilityState?.selected && (
                  <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
                )}
              </TouchableOpacity>
            );
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} colors={colors} />,
          tabBarButton: (props) => {
            const { onPress, accessibilityState, children, delayLongPress, ...restProps } = props;
            return (
              <TouchableOpacity
                onPress={onPress}
                accessibilityState={accessibilityState}
                activeOpacity={0.7}
                style={styles.tabButtonWrapper}
                {...(restProps as any)}
              >
                {children}
                {accessibilityState?.selected && (
                  <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
                )}
              </TouchableOpacity>
            );
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 95,
    paddingBottom: 32,
    paddingTop: 10,
    borderTopWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 8,
    letterSpacing: 0.5,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  tabBarItem: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  tabButtonWrapper: {
    flex: 1,
    position: 'relative',
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    marginBottom: 2,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconWrapperFocused: {
    transform: [{ scale: 1.05 }],
  },
  icon: {
    fontSize: 22,
    opacity: 0.65,
  },
  iconFocused: {
    fontSize: 24,
    opacity: 1,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 28,
    left: '50%',
    marginLeft: -12,
    width: 24,
    height: 3,
    borderRadius: 2,
    zIndex: 10,
  },
});


