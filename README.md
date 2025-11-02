# MusicRewards

A React Native music rewards application built with Expo, featuring Zustand state management, Expo Router navigation, and react-native-track-player for audio playback.

## Prerequisites

- **Node.js 20.11.0** (recommended)
- npm or yarn
- **For iOS:** macOS with Xcode installed
- **For Android:** Android Studio with Android SDK and an emulator/device

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Set Node.js version (if using nvm):**
```bash
nvm use 20.11.0
```

## Running the App

### iOS

```bash
npx expo run:ios
```

For a specific iOS simulator:
```bash
npx expo run:ios --simulator="iPhone 15 Pro"
```

### Android

```bash
npx expo run:android
```

For a specific Android device:
```bash
npx expo run:android --device
```

**Note:** The first build will take 5-10 minutes as it compiles all native dependencies. Subsequent builds will be faster.

## Important Notes

- `react-native-track-player` requires a native development build and will **NOT work in Expo Go**
- You must use `npx expo run:ios` or `npx expo run:android` to build the native app
- The Metro bundler will start automatically after the build completes

## Troubleshooting

### Clear Metro Cache
If you encounter issues, clear the Metro cache:
```bash
npx expo start -c
```

### Audio Not Playing
- Ensure you're running on a device or simulator (not Expo Go)
- Check that TrackPlayer service is properly initialized
- Verify audio URLs are accessible
