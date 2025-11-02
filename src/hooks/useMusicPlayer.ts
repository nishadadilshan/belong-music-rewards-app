import { useState, useCallback, useEffect } from 'react';
import TrackPlayer, { State, useProgress, usePlaybackState } from 'react-native-track-player';
import { MusicChallenge } from '../types';
import { useMusicStore } from '../stores/musicStore';

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
}

export const useMusicPlayer = (): UseMusicPlayerReturn => {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const { currentTrack, setCurrentTrack, setIsPlaying, playbackSpeed, setPlaybackSpeed } = useMusicStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const play = useCallback(
    async (track: MusicChallenge) => {
      try {
        setLoading(true);
        setError(null);

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
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Playback failed';
        setError(errorMessage);
        console.error('Playback error:', err);
      } finally {
        setLoading(false);
      }
    },
    [setCurrentTrack, setIsPlaying, playbackSpeed]
  );

  const pause = useCallback(async () => {
    try {
      await TrackPlayer.pause();
      setIsPlaying(false);
    } catch (err) {
      console.error('Pause error:', err);
    }
  }, [setIsPlaying]);

  const stop = useCallback(async () => {
    try {
      await TrackPlayer.stop();
      await TrackPlayer.reset();
      setCurrentTrack(null);
      setIsPlaying(false);
    } catch (err) {
      console.error('Stop error:', err);
    }
  }, [setCurrentTrack, setIsPlaying]);

  const seekTo = useCallback(async (seconds: number) => {
    try {
      await TrackPlayer.seekTo(seconds);
    } catch (err) {
      console.error('Seek error:', err);
    }
  }, []);

  const setPlaybackSpeedHandler = useCallback(async (speed: number) => {
    try {
      await TrackPlayer.setRate(speed);
      setPlaybackSpeed(speed);
    } catch (err) {
      console.error('Set playback speed error:', err);
      setError('Failed to set playback speed');
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
    loading,
    error,
  };
};

