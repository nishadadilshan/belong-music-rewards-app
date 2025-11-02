import TrackPlayer, {
  Capability,
  State,
  Event,
} from 'react-native-track-player';
import { getErrorMessage } from '../utils/networkUtils';

export interface SetupError {
  message: string;
  code?: string;
  originalError?: unknown;
}

export const setupTrackPlayer = async (): Promise<void> => {
  let retryCount = 0;
  const maxRetries = 2;
  const retryDelay = 1000;

  while (retryCount <= maxRetries) {
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
      console.log('TrackPlayer initialized successfully');
      return;
    } catch (error) {
      console.error(`Error setting up TrackPlayer (attempt ${retryCount + 1}/${maxRetries + 1}):`, error);
      
      // If it's the last retry, throw the error
      if (retryCount >= maxRetries) {
        const friendlyMessage = getErrorMessage(error, 'Failed to initialize audio player');
        const setupError: SetupError = {
          message: friendlyMessage,
          originalError: error,
        };
        
        // Add error code if available
        if (error && typeof error === 'object' && 'code' in error) {
          setupError.code = String(error.code);
        }
        
        throw setupError;
      }
      
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      retryCount++;
    }
  }
};

