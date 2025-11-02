import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { PointsCounter } from '../../src/components/ui/PointsCounter';
import { useMusicPlayer } from '../../src/hooks/useMusicPlayer';
import { usePointsCounter } from '../../src/hooks/usePointsCounter';
import { useMusicStore } from '../../src/stores/musicStore';
import { THEME } from '../../src/constants/theme';

export default function PlayerScreen() {
  const router = useRouter();
  const {
    currentTrack,
    isPlaying,
    currentPosition,
    duration,
    playbackSpeed,
    play,
    pause,
    stop,
    seekTo,
    setPlaybackSpeed,
    loading,
    error,
    retry,
    isRetrying,
  } = useMusicPlayer();
  const {
    currentPoints,
    pointsEarned,
    progress,
    isActive,
    startCounting,
    stopCounting,
  } = usePointsCounter();
  const { updateProgress } = useMusicStore();

  const [hasStarted, setHasStarted] = useState(false);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const translateY = useState(new Animated.Value(0))[0];
  const opacity = useState(new Animated.Value(1))[0];

  useEffect(() => {
    if (currentTrack && !hasStarted) {
      startCounting({
        totalPoints: currentTrack.points,
        durationSeconds: currentTrack.duration,
        challengeId: currentTrack.id,
      });
      setHasStarted(true);
    }
  }, [currentTrack, hasStarted, startCounting]);

  useEffect(() => {
    if (currentTrack && isActive) {
      updateProgress(currentTrack.id, progress);
    }
  }, [progress, currentTrack, isActive, updateProgress]);

  useEffect(() => {
    if (progress >= 100 && currentTrack) {
      stopCounting();
    }
  }, [progress, currentTrack, stopCounting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (position: number) => {
    seekTo(position);
  };

  const handlePlayPause = async () => {
    if (!currentTrack) return;
    
    if (isPlaying) {
      await pause();
    } else {
      await play(currentTrack);
    }
  };

  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainerFullScreen}>
          <Text style={styles.errorText}>No track selected</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleClose = async () => {
    router.back();
  };

  // Swipe down gesture handler
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only allow downward swipes
      if (event.translationY > 0) {
        translateY.setValue(event.translationY);
        // Reduce opacity as user swipes down (max 200px for full fade)
        const opacityValue = Math.max(0, 1 - event.translationY / 200);
        opacity.setValue(opacityValue);
      }
    })
    .onEnd((event) => {
      // Close if swiped down more than 150px OR if velocity is high enough (> 500)
      const shouldClose = event.translationY > 150 || (event.translationY > 100 && event.velocityY > 500);
      
      if (shouldClose) {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 500,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          handleClose();
        });
      } else {
        // Spring back to original position
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            damping: 20,
            stiffness: 300,
            useNativeDriver: true,
          }),
          Animated.spring(opacity, {
            toValue: 1,
            damping: 20,
            stiffness: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.gestureContainer,
            {
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.swipeIndicator} />
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
        <GlassCard style={styles.trackCard}>
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle}>{currentTrack.title}</Text>
            <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
          </View>
        </GlassCard>

        <PointsCounter
          currentPoints={pointsEarned}
          targetPoints={currentTrack.points}
          progress={progress}
        />

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={[styles.retryButton, (loading || isRetrying) && styles.disabled]}
              onPress={retry}
              disabled={loading || isRetrying}
            >
              <Text style={styles.retryButtonText}>
                {isRetrying ? 'Retrying...' : '🔄 Retry'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handleSeek(Math.max(0, currentPosition - 10))}
          >
            <Text style={styles.controlButtonText}>⏪ 10s</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playButton, loading && styles.disabled]}
            onPress={handlePlayPause}
            disabled={loading}
          >
            <Text style={styles.playButtonText}>
              {loading ? '⏳' : isPlaying ? '⏸' : '▶'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handleSeek(Math.min(duration, currentPosition + 10))}
          >
            <Text style={styles.controlButtonText}>10s ⏩</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.speedControls}>
          <Text style={styles.speedLabel}>Speed</Text>
          <View style={styles.speedButtons}>
            {[0.5, 1, 1.25, 2].map((speed) => (
              <TouchableOpacity
                key={speed}
                style={[
                  styles.speedButton,
                  playbackSpeed === speed && styles.speedButtonActive,
                ]}
                onPress={() => setPlaybackSpeed(speed)}
              >
                <Text
                  style={[
                    styles.speedButtonText,
                    playbackSpeed === speed && styles.speedButtonTextActive,
                  ]}
                >
                  {speed}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
          <View
            style={styles.progressBarContainer}
            onLayout={(e) => {
              setProgressBarWidth(e.nativeEvent.layout.width);
            }}
          >
            <TouchableOpacity
              style={styles.progressBarTouchable}
              activeOpacity={1}
              onPress={(e) => {
                if (progressBarWidth > 0 && duration > 0) {
                  const { locationX } = e.nativeEvent;
                  const percentage = locationX / progressBarWidth;
                  handleSeek(percentage * duration);
                }
              }}
            >
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${
                        duration > 0 ? (currentPosition / duration) * 100 : 0
                      }%`,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
        </View>
        </Animated.View>
      </GestureDetector>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  gestureContainer: {
    flex: 1,
  },
  header: {
    padding: THEME.spacing.md,
    alignItems: 'flex-end',
    position: 'relative',
  },
  swipeIndicator: {
    position: 'absolute',
    top: 8,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.colors.text.secondary,
    opacity: 0.5,
  },
  closeButton: {
    color: THEME.colors.text.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: THEME.spacing.lg,
    justifyContent: 'space-between',
  },
  trackCard: {
    padding: THEME.spacing.lg,
    alignItems: 'center',
  },
  trackInfo: {
    alignItems: 'center',
  },
  trackTitle: {
    color: THEME.colors.text.primary,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: THEME.fonts.bold,
    marginBottom: THEME.spacing.xs,
  },
  trackArtist: {
    color: THEME.colors.text.secondary,
    fontSize: 18,
    fontFamily: THEME.fonts.regular,
  },
  errorContainer: {
    marginVertical: THEME.spacing.md,
    alignItems: 'center',
    padding: THEME.spacing.md,
  },
  errorText: {
    color: THEME.colors.error,
    textAlign: 'center',
    marginBottom: THEME.spacing.sm,
    fontSize: 14,
    fontFamily: THEME.fonts.regular,
  },
  retryButton: {
    marginTop: THEME.spacing.sm,
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.primary,
    ...THEME.shadows.sm,
  },
  retryButtonText: {
    color: THEME.colors.text.primary,
    fontSize: 14,
    fontFamily: THEME.fonts.medium,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: THEME.spacing.lg,
    marginVertical: THEME.spacing.xl,
  },
  controlButton: {
    padding: THEME.spacing.md,
  },
  controlButtonText: {
    color: THEME.colors.text.primary,
    fontSize: 16,
    fontFamily: THEME.fonts.medium,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...THEME.shadows.md,
    shadowColor: THEME.colors.primary,
    shadowOpacity: 0.4,
  },
  playButtonText: {
    color: THEME.colors.text.primary,
    fontSize: 32,
  },
  disabled: {
    opacity: 0.5,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  timeText: {
    color: THEME.colors.text.secondary,
    fontSize: 12,
    fontFamily: THEME.fonts.regular,
    minWidth: 40,
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  progressBarTouchable: {
    width: '100%',
    height: '100%',
  },
  progressBar: {
    width: '100%',
    height: '100%',
    backgroundColor: THEME.colors.glassDark,
    borderRadius: THEME.borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.full,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    color: THEME.colors.primary,
    fontSize: 16,
    marginTop: THEME.spacing.md,
  },
  speedControls: {
    marginVertical: THEME.spacing.lg,
    alignItems: 'center',
  },
  speedLabel: {
    color: THEME.colors.text.secondary,
    fontSize: 14,
    fontFamily: THEME.fonts.medium,
    marginBottom: THEME.spacing.sm,
  },
  speedButtons: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
  },
  speedButton: {
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.glassDark,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    minWidth: 60,
    alignItems: 'center',
  },
  speedButtonActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  speedButtonText: {
    color: THEME.colors.text.secondary,
    fontSize: 14,
    fontFamily: THEME.fonts.medium,
  },
  speedButtonTextActive: {
    color: THEME.colors.text.primary,
    fontWeight: 'bold',
  },
  errorContainerFullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

