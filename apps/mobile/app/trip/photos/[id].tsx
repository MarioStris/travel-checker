import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as Haptics from "expo-haptics";
import { useTripDetail } from "@/hooks/useTrips";
import { useUploadPhoto, useDeletePhoto, useSetCoverPhoto } from "@/hooks/usePhotos";
import type { TripPhotoDTO } from "@travel-checker/shared/src/types";

const SCREEN_WIDTH = Dimensions.get("window").width;
const GRID_GAP = 4;
const COLS = 3;
const ITEM_SIZE = (SCREEN_WIDTH - 32 - GRID_GAP * (COLS - 1)) / COLS;
const MAX_PHOTOS = 20;
const MAX_DIMENSION = 1920;

export default function PhotoManageScreen() {
  const { id: tripId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: trip, isLoading } = useTripDetail(tripId);
  const { mutateAsync: uploadPhoto } = useUploadPhoto();
  const { mutate: deletePhoto } = useDeletePhoto();
  const { mutateAsync: setCover } = useSetCoverPhoto();
  const [uploading, setUploading] = useState<Record<string, number>>({});

  const photos = trip?.photos ?? [];
  const atLimit = photos.length >= MAX_PHOTOS;

  const compressImage = useCallback(async (uri: string) => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: MAX_DIMENSION } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  }, []);

  const handlePickPhotos = async () => {
    if (atLimit) {
      Alert.alert("Limit reached", `Maximum ${MAX_PHOTOS} photos per trip.`);
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo library access in Settings.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: MAX_PHOTOS - photos.length,
      quality: 0.9,
    });

    if (result.canceled || !result.assets.length) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUploading({});

    for (const asset of result.assets) {
      const tempId = asset.uri;
      setUploading((prev) => ({ ...prev, [tempId]: 0 }));

      try {
        const compressed = await compressImage(asset.uri);
        setUploading((prev) => ({ ...prev, [tempId]: 50 }));

        const fileName = asset.uri.split("/").pop() ?? "photo.jpg";
        const contentType = fileName.endsWith(".png") ? "image/png" as const : "image/jpeg" as const;

        await uploadPhoto({ tripId, fileUri: compressed, fileName, contentType });
        setUploading((prev) => ({ ...prev, [tempId]: 100 }));
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        Alert.alert("Upload failed", "Could not upload one of the photos.");
      } finally {
        setUploading((prev) => {
          const next = { ...prev };
          delete next[tempId];
          return next;
        });
      }
    }
  };

  const handleDeletePhoto = (photo: TripPhotoDTO) => {
    Alert.alert("Delete photo", "Remove this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          deletePhoto({ photoId: photo.id, tripId });
        },
      },
    ]);
  };

  const handleSetCover = async (photo: TripPhotoDTO) => {
    try {
      await setCover({ photoId: photo.id, tripId });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      Alert.alert("Error", "Could not set cover photo.");
    }
  };

  const handlePhotoOptions = (photo: TripPhotoDTO) => {
    Alert.alert(photo.caption ?? "Photo", undefined, [
      { text: "Set as Cover", onPress: () => void handleSetCover(photo) },
      { text: "Delete", style: "destructive", onPress: () => handleDeletePhoto(photo) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const uploadCount = Object.keys(uploading).length;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back">
          <Text className="text-sky-500 font-semibold">Back</Text>
        </TouchableOpacity>
        <Text className="text-base font-bold text-gray-900">
          Photos ({photos.length}/{MAX_PHOTOS})
        </Text>
        <TouchableOpacity
          onPress={handlePickPhotos}
          disabled={atLimit}
          accessibilityRole="button"
          accessibilityLabel="Add photos"
        >
          <Text className={`font-semibold ${atLimit ? "text-gray-300" : "text-sky-500"}`}>
            Add
          </Text>
        </TouchableOpacity>
      </View>

      {/* Upload progress */}
      {uploadCount > 0 && (
        <View className="bg-sky-50 px-4 py-2 flex-row items-center">
          <ActivityIndicator size="small" color="#0ea5e9" />
          <Text className="text-sm text-sky-700 ml-2">
            Uploading {uploadCount} photo{uploadCount > 1 ? "s" : ""}...
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {photos.length === 0 && uploadCount === 0 ? (
          <View className="items-center py-16">
            <Text className="text-4xl mb-3">📷</Text>
            <Text className="text-lg font-semibold text-gray-900">No photos yet</Text>
            <Text className="text-sm text-gray-500 mt-1 text-center px-8">
              Add photos to capture your travel memories.
            </Text>
            <TouchableOpacity
              onPress={handlePickPhotos}
              className="bg-sky-500 px-6 py-3 rounded-xl mt-4"
            >
              <Text className="text-white font-semibold">Choose Photos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row flex-wrap" style={{ gap: GRID_GAP }}>
            {photos.map((photo) => (
              <TouchableOpacity
                key={photo.id}
                onPress={() => handlePhotoOptions(photo)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={photo.caption ?? "Trip photo"}
              >
                <Image
                  source={{ uri: photo.thumbnailUrl ?? photo.url }}
                  style={{ width: ITEM_SIZE, height: ITEM_SIZE, borderRadius: 12 }}
                />
                {trip?.coverPhotoUrl === photo.url && (
                  <View className="absolute top-1.5 left-1.5 bg-black/60 px-1.5 py-0.5 rounded-md">
                    <Text className="text-white text-xs font-medium">Cover</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {!atLimit && (
              <TouchableOpacity
                onPress={handlePickPhotos}
                style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
                className="rounded-xl border-2 border-dashed border-gray-300 items-center justify-center bg-gray-50"
                accessibilityRole="button"
                accessibilityLabel="Add more photos"
              >
                <Text className="text-2xl text-gray-400">+</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
