import type {
  UserDTO,
  UserStatsDTO,
  UpdateProfileInput,
} from "@travel-checker/shared/src/types";
import { get, patch, post } from "./client";

export async function fetchCurrentUser(): Promise<UserDTO> {
  return get<UserDTO>("/api/users/me");
}

export async function fetchUserStats(): Promise<UserStatsDTO> {
  return get<UserStatsDTO>("/api/users/me/stats");
}

export async function fetchStatsFromDedicated(): Promise<UserStatsDTO> {
  const response = await get<{ data: UserStatsDTO }>("/api/stats/me");
  return response.data;
}

export async function updateProfile(
  input: UpdateProfileInput
): Promise<UserDTO> {
  return patch<UserDTO>("/api/users/me", input);
}

export async function uploadAvatar(fileUri: string): Promise<string> {
  // Fetch the file first to get the actual blob and detect content type
  const fileResponse = await fetch(fileUri);
  const blob = await fileResponse.blob();
  const contentType = blob.type && blob.type !== "application/octet-stream"
    ? blob.type
    : "image/jpeg";
  const ext = contentType === "image/png" ? "png" : "jpg";

  const { uploadUrl, avatarUrl } = await post<{
    uploadUrl: string;
    avatarUrl: string;
  }>("/api/users/me/avatar", { fileName: `avatar.${ext}`, contentType });

  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    body: blob,
    headers: { "Content-Type": contentType },
  });

  if (!uploadRes.ok) {
    throw new Error(`Avatar upload failed: ${uploadRes.status}`);
  }

  return avatarUrl;
}

export async function syncUser(data: {
  clerkId: string;
  email: string;
}): Promise<UserDTO> {
  return post<UserDTO>("/api/users/sync", data);
}
