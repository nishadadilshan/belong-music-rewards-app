import TrackPlayer, {
  Capability,
  State,
  Event,
} from 'react-native-track-player';

export const setupTrackPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SeekTo,
      ],
      progressUpdateEventInterval: 1,
    });
  } catch (error) {
    console.error('Error setting up TrackPlayer:', error);
    throw error;
  }
};

