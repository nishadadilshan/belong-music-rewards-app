import { useState, useCallback, useEffect, useRef } from 'react';
import TrackPlayer, { State, useProgress, usePlaybackState, Event } from 'react-native-track-player';
import { MusicChallenge } from '../types';
import { useMusicStore } from '../stores/musicStore';
import { checkNetworkStatus, isNetworkError, getErrorMessage } from '../utils/networkUtils';

interface UseMusicPlayerReturn {
  isPlaying: boolean;
  currentTrack: MusicChallenge | null;
  currentPosition: number;
  duration: number;
  playbackSpeed: number;
  play: (track: MusicChallenge) => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  seekTo: (seconds: number) => Promise<void>;
  setPlaybackSpeed: (speed: number) => Promise<void>;
  loading: boolean;
  error: string | null;
  retry: () => Promise<void>;
  isRetrying: boolean;
}

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2000; // 2 seconds

export const useMusicPlayer = (): UseMusicPlayerReturn => {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const { currentTrack, setCurrentTrack, setIsPlaying, playbackSpeed, setPlaybackSpeed } = useMusicStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const retryCountRef = useRef(0);
  const lastFailedTrackRef = useRef<MusicChallenge | null>(null);
  const playbackErrorSubscriptionRef = useRef<(() => void) | null>(null);

  // Set up playback error listener
  useEffect(() => {
    const subscription = TrackPlayer.addEventListener(Event.PlaybackError, async ({ error }) => {
      console.error('Playback error event received:', error);
      
      const errorMessage = error?.message || error?.localizedDescription || 'Playback failed';
      const friendlyMessage = getErrorMessage(error, errorMessage);
      
      setError(friendlyMessage);
      setIsPlaying(false);
      
      // If it's a network error and we haven't exceeded retry limit, prepare for retry
      if (isNetworkError(error) && currentTrack && retryCountRef.current < MAX_RETRY_ATTEMPTS) {
        console.log(`Network error detected, will retry (attempt ${retryCountRef.current + 1}/${MAX_RETRY_ATTEMPTS})`);
        lastFailedTrackRef.current = currentTrack;
      }
    });

    playbackErrorSubscriptionRef.current = () => {
      subscription.remove();
    };

    return () => {
      if (playbackErrorSubscriptionRef.current) {
        playbackErrorSubscriptionRef.current();
      }
    };
  }, [currentTrack]);

  const play = useCallback(
    async (track: MusicChallenge, isRetry: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        // Check network status before attempting to play
        const networkStatus = await checkNetworkStatus();
        if (!networkStatus.isConnected && !networkStatus.isInternetReachable) {
          throw new Error('No internet connection. Please connect to a network and try again.');
        }

        // Reset retry count on new track (not a retry)
        if (!isRetry) {
          retryCountRef.current = 0;
          lastFailedTrackRef.current = null;
        }

        await TrackPlayer.reset();
        await TrackPlayer.add({
          id: track.id,
          url: track.audioUrl,
          title: track.title,
          artist: track.artist,
          duration: track.duration,
        });

        await TrackPlayer.play();
        // Apply the stored playback speed
        await TrackPlayer.setRate(playbackSpeed);
        setCurrentTrack(track);
        setIsPlaying(true);
        
        // Reset retry count on successful play
        retryCountRef.current = 0;
        lastFailedTrackRef.current = null;
      } catch (err) {
        const friendlyMessage = getErrorMessage(err, 'Playback failed');
        setError(friendlyMessage);
        console.error('Playback error:', err);

        // Store failed track for retry
        if (!isRetry) {
          lastFailedTrackRef.current = track;
        }

        // For network errors, we'll allow retry
        if (isNetworkError(err)) {
          console.log(`Network error detected, retry count: ${retryCountRef.current}`);
        }
      } finally {
        setLoading(false);
      }
    },
    [setCurrentTrack, setIsPlaying, playbackSpeed]
  );

  const retry = useCallback(async () => {
    if (!lastFailedTrackRef.current || retryCountRef.current >= MAX_RETRY_ATTEMPTS) {
      setError('Maximum retry attempts reached. Please check your connection and try again.');
      return;
    }

    setIsRetrying(true);
    retryCountRef.current += 1;

    try {
      // Wait before retrying (exponential backoff)
      const delay = RETRY_DELAY_MS * retryCountRef.current;
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Check network again before retry
      const networkStatus = await checkNetworkStatus();
      if (!networkStatus.isConnected && !networkStatus.isInternetReachable) {
        throw new Error('No internet connection. Please connect to a network and try again.');
      }

      console.log(`Retrying playback (attempt ${retryCountRef.current}/${MAX_RETRY_ATTEMPTS})`);
      await play(lastFailedTrackRef.current, true);
    } catch (err) {
      const friendlyMessage = getErrorMessage(err, 'Retry failed');
      setError(friendlyMessage);
      console.error('Retry error:', err);

      if (retryCountRef.current >= MAX_RETRY_ATTEMPTS) {
        setError('Maximum retry attempts reached. Please check your connection and try again.');
      }
    } finally {
      setIsRetrying(false);
    }
  }, [play]);

  const pause = useCallback(async () => {
    try {
      await TrackPlayer.pause();
      setIsPlaying(false);
    } catch (err) {
      const friendlyMessage = getErrorMessage(err, 'Failed to pause playback');
      setError(friendlyMessage);
      console.error('Pause error:', err);
    }
  }, [setIsPlaying]);

  const stop = useCallback(async () => {
    try {
      await TrackPlayer.stop();
      await TrackPlayer.reset();
      setCurrentTrack(null);
      setIsPlaying(false);
      // Reset error and retry state on stop
      setError(null);
      retryCountRef.current = 0;
      lastFailedTrackRef.current = null;
    } catch (err) {
      const friendlyMessage = getErrorMessage(err, 'Failed to stop playback');
      setError(friendlyMessage);
      console.error('Stop error:', err);
    }
  }, [setCurrentTrack, setIsPlaying]);

  const seekTo = useCallback(async (seconds: number) => {
    try {
      await TrackPlayer.seekTo(seconds);
    } catch (err) {
      console.error('Seek error:', err);
      // Don't set error for seek failures as they're usually minor
    }
  }, []);

  const setPlaybackSpeedHandler = useCallback(async (speed: number) => {
    try {
      await TrackPlayer.setRate(speed);
      setPlaybackSpeed(speed);
    } catch (err) {
      const friendlyMessage = getErrorMessage(err, 'Failed to set playback speed');
      setError(friendlyMessage);
      console.error('Set playback speed error:', err);
    }
  }, [setPlaybackSpeed]);

  useEffect(() => {
    const state = playbackState?.state;
    if (state === State.Playing) {
      setIsPlaying(true);
    } else if (state === State.Paused || state === State.Ready) {
      setIsPlaying(false);
    }
  }, [playbackState, setIsPlaying]);

  const isPlayingState = playbackState?.state === State.Playing;

  return {
    isPlaying: isPlayingState,
    currentTrack,
    currentPosition: progress.position,
    duration: progress.duration,
    playbackSpeed,
    play,
    pause,
    stop,
    seekTo,
    setPlaybackSpeed: setPlaybackSpeedHandler,
    loading: loading || isRetrying,
    error,
    retry,
    isRetrying,
  };
};

