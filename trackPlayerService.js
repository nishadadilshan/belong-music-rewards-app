// TrackPlayer service module (required for background playback)
const TrackPlayer = require('react-native-track-player').default;

module.exports = async function () {
  // Register event handlers for remote control events
  TrackPlayer.addEventListener('remote-play', () => {
    TrackPlayer.play();
  });
  
  TrackPlayer.addEventListener('remote-pause', () => {
    TrackPlayer.pause();
  });
  
  TrackPlayer.addEventListener('remote-stop', () => {
    TrackPlayer.stop();
  });
  
  TrackPlayer.addEventListener('remote-seek', (event) => {
    TrackPlayer.seekTo(event.position);
  });
};

