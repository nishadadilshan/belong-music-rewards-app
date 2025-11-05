# MusicRewards

A React Native music rewards application built with Expo, featuring Zustand state management, Expo Router navigation, and react-native-track-player for audio playback.

## Prerequisites

- **Node.js 20.11.0** (nvm: `nvm use 20.11.0`)
- npm or yarn
- **Java 17 (JDK 17)**
- **For iOS:** macOS with Xcode installed
- **For Android:** Android Studio with SDK + NDK installed
  - Android SDK Platform: **API 36** (compileSdk 36, targetSdk 36, minSdk 24)
  - Android Build Tools: **36.0.0**
  - Android NDK: **26.1.10909125** (pinned)
  - CMake: 3.22.x (installed via Android SDK)
  - Gradle Wrapper: **8.14.3** (auto via project)
  - Kotlin: **2.1.20** (auto via plugin)

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

### Quick run (dev)

1. Ensure Node matches: `nvm use 20.11.0`
2. Start Metro (clear cache recommended on first run):

```bash
npx expo start --clear
```

3. In a separate terminal, install and run the native app:

```bash
# Android (Windows PowerShell)
npx expo run:android

# iOS (macOS)
npx expo run:ios
```

4. If the dev build is already installed, you can usually just start Metro and reload instead of rebuilding.

### Build and run (release-like)

```bash
# Android release build (installs a release variant without dev tools)
cd android; ./gradlew assembleRelease installRelease  # macOS/Linux
cd android; .\gradlew.bat assembleRelease installRelease  # Windows
```

## Emulator / Simulator setup

### Android Emulator (AVD)

- Open Android Studio → Device Manager → Create Device
- Pick a Pixel device (e.g., Pixel 7/8)
- Select a system image: Android 14 (API 34) or newer (API 36 if available)
- Finish setup and click the ▶ to start the AVD

Tips:
- Ensure virtualization is enabled in BIOS/UEFI
- Install "Android Emulator Hypervisor Driver" (Windows: SDK Manager → SDK Tools)
- If Metro cannot connect, run: `adb reverse tcp:8081 tcp:8081`

Useful commands:

```bash
# List devices
adb devices

# Start a specific AVD from CLI (example name)
emulator -list-avds
emulator -avd Pixel_7_API_34

# View device logs
adb logcat
```

### iOS Simulator (macOS)

- Install Xcode from the App Store
- Open Xcode → Settings → Platforms to install iOS Simulator runtimes
- Launch Simulator via Xcode (Window → Devices and Simulators) or from Spotlight

Run on a specific simulator:

```bash
npx expo run:ios --simulator "iPhone 15 Pro"
```

## Android build configuration (required)

- **New Architecture:** disabled
  - `app.json` → `expo.newArchEnabled: false`
  - `android/gradle.properties` → `newArchEnabled=false`
- **Hermes:** enabled (default for RN 0.81)
- **NDK pinned:** `android/app/build.gradle` → `ndkVersion "26.1.10909125"`

These settings avoid C++ linker issues seen with newer NDKs.

## Verified package/runtime versions

- **Expo SDK:** 54 (`expo ~54.0.20`)
- **React Native:** 0.81.5
- **React:** 19.1.0
- **react-native-track-player:** 4.1.2

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

### Clean Android build
```bash
# Windows PowerShell
cd android; .\gradlew.bat clean

# macOS/Linux
cd android && ./gradlew clean
```

### If you see C++/linker errors during Android build
- Ensure Android NDK **26.1.10909125** is installed (SDK Manager → SDK Tools → NDK)
- Confirm `android/app/build.gradle` pins `ndkVersion "26.1.10909125"`
- Make sure New Architecture is disabled (see above)

### Audio Not Playing
- Ensure you're running on a device or simulator (not Expo Go)
- Check that TrackPlayer service is properly initialized
- Verify audio URLs are accessible
