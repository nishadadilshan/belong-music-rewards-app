// TrackPlayer service module (required for background playback)
const TrackPlayer = require('react-native-track-player').default;

// Global error handler reference to notify React components
let globalErrorHandler = null;

module.exports = async function () {
  // Register event handlers for remote control events
  TrackPlayer.addEventListener('remote-play', () => {
    TrackPlayer.play().catch((error) => {
      console.error('Remote play error:', error);
    });
  });
  
  TrackPlayer.addEventListener('remote-pause', () => {
    TrackPlayer.pause().catch((error) => {
      console.error('Remote pause error:', error);
    });
  });
  
  TrackPlayer.addEventListener('remote-stop', () => {
    TrackPlayer.stop().catch((error) => {
      console.error('Remote stop error:', error);
    });
  });
  
  TrackPlayer.addEventListener('remote-seek', (event) => {
    TrackPlayer.seekTo(event.position).catch((error) => {
      console.error('Remote seek error:', error);
    });
  });

  // Handle playback errors (network issues, audio failures, etc.)
  TrackPlayer.addEventListener('playback-error', async ({ error }) => {
    console.error('Playback error event:', error);
    
    // Extract error details
    const errorMessage = error?.message || error?.localizedDescription || 'Playback failed';
    const errorCode = error?.code || error?.errorCode || null;
    
    // Log detailed error information
    console.error('Error details:', {
      message: errorMessage,
      code: errorCode,
      error: JSON.stringify(error),
    });

    // Notify global error handler if set
    if (globalErrorHandler) {
      globalErrorHandler({
        message: errorMessage,
        code: errorCode,
        type: 'playback',
      });
    }
  });

  // Handle playback queue ended
  TrackPlayer.addEventListener('playback-queue-ended', (event) => {
    console.log('Playback queue ended:', event);
  });

  // Handle playback track changed
  TrackPlayer.addEventListener('playback-track-changed', (event) => {
    console.log('Track changed:', event);
    
    // Check for errors during track change
    if (event.nextTrack === null && event.track !== null) {
      console.warn('Track ended unexpectedly, may indicate playback error');
    }
  });
};

// Export function to set global error handler
module.exports.setGlobalErrorHandler = (handler) => {
  globalErrorHandler = handler;
};

