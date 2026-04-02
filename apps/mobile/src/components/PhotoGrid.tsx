import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import type { TripPhotoDTO } from "@travel-checker/shared/src/types";
import { useUploadPhoto, useDeletePhoto } from "@/hooks/usePhotos";

const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_SIZE = (SCREEN_WIDTH - 32 - 8) / 3;

interface PhotoGridProps {
  tripId: string;
  photos: TripPhotoDTO[];
  editable?: boolean;
}

export function PhotoGrid({ tripId, photos, editable = false }: PhotoGridProps) {
  const { mutateAsync: uploadPhoto, isPending: isUploading } = useUploadPhoto();
  const { mutate: deletePhoto } = useDeletePhoto();

  const handleAddPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow photo library access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const fileName = asset.uri.split("/").pop() ?? "photo.jpg";
      const contentType =
        fileName.endsWith(".png") ? "image/png" : "image/jpeg";

      await uploadPhoto({
        tripId,
        fileUri: asset.uri,
        fileName,
        contentType,
      });
    }
  };

  const handleLongPress = (photo: TripPhotoDTO) => {
    if (!editable) return;
    Alert.alert("Delete photo", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deletePhoto({ photoId: photo.id, tripId }),
      },
    ]);
  };

  return (
    <View className="flex-row flex-wrap gap-2">
      {photos.map((photo) => (
        <TouchableOpacity
          key={photo.id}
          onLongPress={() => handleLongPress(photo)}
        >
          <Image
            source={{ uri: photo.url }}
            style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
            className="rounded-xl"
          />
        </TouchableOpacity>
      ))}

      {editable && (
        <TouchableOpacity
          onPress={handleAddPhoto}
          disabled={isUploading}
          style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
          className="rounded-xl border-2 border-dashed border-gray-300 items-center justify-center bg-gray-50"
        >
          <Text className="text-2xl text-gray-400">+</Text>
          <Text className="text-xs text-gray-400 mt-1">
            {isUploading ? "Uploading..." : "Add photo"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
