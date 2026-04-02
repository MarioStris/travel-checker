import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Travel Checker",
  slug: "travel-checker",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#0ea5e9",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.travelchecker.app",
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "Travel Checker uses your location to show nearby places on the map.",
      NSLocationAlwaysAndWhenInUseUsageDescription:
        "Travel Checker uses your location to show nearby places on the map.",
      NSCameraUsageDescription:
        "Travel Checker needs camera access to take photos for your trips.",
      NSPhotoLibraryUsageDescription:
        "Travel Checker needs photo library access to upload trip photos.",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#0ea5e9",
    },
    package: "com.travelchecker.app",
    permissions: [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
    ],
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    [
      "expo-image-picker",
      {
        photosPermission:
          "Travel Checker needs access to your photos to upload trip images.",
        cameraPermission:
          "Travel Checker needs camera access to take photos for your trips.",
      },
    ],
    [
      "expo-location",
      {
        locationWhenInUsePermission:
          "Travel Checker uses your location to show nearby places on the map.",
      },
    ],
  ],
  extra: {
    clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001",
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    eas: {
      projectId: "travel-checker",
    },
  },
  scheme: "travel-checker",
});
