import type {
  TripPhotoDTO,
  RequestUploadUrlInput,
  UploadUrlResponse,
} from "@travel-checker/shared/src/types";
import { post, del } from "./client";

export async function requestUploadUrl(
  input: RequestUploadUrlInput
): Promise<UploadUrlResponse> {
  return post<UploadUrlResponse>("/api/photos/upload-url", input);
}

export async function uploadFileToS3(
  uploadUrl: string,
  fileUri: string,
  contentType: string
): Promise<void> {
  const response = await fetch(fileUri);
  const blob = await response.blob();

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: blob,
  });

  if (!uploadResponse.ok) {
    throw new Error(`Upload failed with status: ${uploadResponse.status}`);
  }
}

export async function deletePhoto(photoId: string): Promise<void> {
  return del<void>(`/api/photos/${photoId}`);
}

export async function uploadTripPhoto(
  tripId: string,
  fileUri: string,
  fileName: string,
  contentType: "image/jpeg" | "image/png" | "image/webp" | "image/heic",
  caption?: string
): Promise<TripPhotoDTO> {
  const { uploadUrl, photo } = await requestUploadUrl({
    tripId,
    fileName,
    contentType,
    caption,
  });

  await uploadFileToS3(uploadUrl, fileUri, contentType);

  return photo;
}
