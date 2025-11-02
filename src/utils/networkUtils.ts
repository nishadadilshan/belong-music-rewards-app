import * as Network from 'expo-network';

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
}

/**
 * Check if the device has network connectivity
 */
export const checkNetworkStatus = async (): Promise<NetworkStatus> => {
  try {
    const networkState = await Network.getNetworkStateAsync();
    return {
      isConnected: networkState.isConnected ?? false,
      isInternetReachable: networkState.isInternetReachable ?? null,
      type: networkState.type ?? null,
    };
  } catch (error) {
    console.error('Error checking network status:', error);
    // Default to assuming no connection if check fails
    return {
      isConnected: false,
      isInternetReachable: false,
      type: null,
    };
  }
};

/**
 * Check if error is network-related
 */
export const isNetworkError = (error: unknown): boolean => {
  if (!error) return false;

  const errorMessage = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  const errorString = JSON.stringify(error).toLowerCase();

  // Common network error patterns
  const networkErrorPatterns = [
    'network',
    'connection',
    'timeout',
    'econnrefused',
    'enetunreach',
    'econnreset',
    'enotfound',
    'fetch',
    'no internet',
    'offline',
    'failed to fetch',
    'network request failed',
    'load failed',
    'http error',
    '500',
    '502',
    '503',
    '504',
    '403',
    '404',
  ];

  return networkErrorPatterns.some(
    (pattern) => errorMessage.includes(pattern) || errorString.includes(pattern)
  );
};

/**
 * Get user-friendly error message based on error type
 */
export const getErrorMessage = (error: unknown, defaultMessage: string = 'An error occurred'): string => {
  if (!error) return defaultMessage;

  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorLower = errorMessage.toLowerCase();

  // Network-specific errors
  if (isNetworkError(error)) {
    if (errorLower.includes('timeout') || errorLower.includes('timed out')) {
      return 'Connection timeout. Please check your internet connection and try again.';
    }
    if (errorLower.includes('404') || errorLower.includes('not found')) {
      return 'Audio file not found. The track may have been removed.';
    }
    if (errorLower.includes('403') || errorLower.includes('forbidden')) {
      return 'Access denied. Unable to play this track.';
    }
    if (errorLower.includes('500') || errorLower.includes('502') || errorLower.includes('503') || errorLower.includes('504')) {
      return 'Server error. Please try again later.';
    }
    if (errorLower.includes('no internet') || errorLower.includes('offline')) {
      return 'No internet connection. Please connect to a network and try again.';
    }
    return 'Network error. Please check your connection and try again.';
  }

  // Audio-specific errors
  if (errorLower.includes('format') || errorLower.includes('codec') || errorLower.includes('decode')) {
    return 'Audio format not supported. Unable to play this track.';
  }
  if (errorLower.includes('permission') || errorLower.includes('denied')) {
    return 'Permission denied. Unable to access audio playback.';
  }

  // Generic error with original message if available
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return defaultMessage;
};

