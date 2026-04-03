import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadTripPhoto, deletePhoto, setCoverPhoto } from "@/api/photos";
import { TRIP_KEYS } from "./useTrips";

interface UploadPhotoInput {
  tripId: string;
  fileUri: string;
  fileName: string;
  contentType: "image/jpeg" | "image/png" | "image/webp" | "image/heic";
  caption?: string;
}

export function useUploadPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UploadPhotoInput) =>
      uploadTripPhoto(
        input.tripId,
        input.fileUri,
        input.fileName,
        input.contentType,
        input.caption
      ),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: TRIP_KEYS.detail(variables.tripId),
      });
      void queryClient.invalidateQueries({ queryKey: TRIP_KEYS.all });
    },
  });
}

export function useDeletePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ photoId }: { photoId: string; tripId: string }) =>
      deletePhoto(photoId),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: TRIP_KEYS.detail(variables.tripId),
      });
      void queryClient.invalidateQueries({ queryKey: TRIP_KEYS.all });
    },
  });
}

export function useSetCoverPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ photoId }: { photoId: string; tripId: string }) =>
      setCoverPhoto(photoId),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: TRIP_KEYS.detail(variables.tripId),
      });
      void queryClient.invalidateQueries({ queryKey: TRIP_KEYS.all });
    },
  });
}
