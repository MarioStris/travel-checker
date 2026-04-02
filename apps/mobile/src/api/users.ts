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
  // Stats endpoint returns stats directly from getUserStats service
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

export async function syncUser(): Promise<UserDTO> {
  return post<UserDTO>("/api/users/sync");
}
