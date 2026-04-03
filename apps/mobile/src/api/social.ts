import { get, post, patch, del } from "./client";
import type {
  UserSearchResponse,
  UserProfileDTO,
  FriendRequestDTO,
  ReactionDTO,
  ReactionSummary,
  ReactionEmoji,
  CommentDTO,
  CommentsResponse,
  TripVisibility,
} from "@/types/social";

/* ---------- User Search ---------- */

export function searchUsers(query: string, page = 1, pageSize = 20) {
  return get<UserSearchResponse>("/api/users/search", {
    params: { q: query, page, pageSize },
  });
}

export function fetchUserProfile(userId: string) {
  return get<UserProfileDTO>(`/api/users/${userId}/profile`);
}

/* ---------- Friend Requests ---------- */

export function sendFriendRequest(toUserId: string) {
  return post<FriendRequestDTO>("/api/friends/requests", { toUserId });
}

export function fetchPendingRequests() {
  return get<FriendRequestDTO[]>("/api/friends/requests");
}

export function respondToFriendRequest(
  requestId: string,
  action: "accept" | "decline"
) {
  return patch<FriendRequestDTO>(`/api/friends/requests/${requestId}`, {
    action,
  });
}

export function fetchFriends() {
  return get<UserProfileDTO[]>("/api/friends");
}

/* ---------- Reactions ---------- */

export function fetchReactions(tripId: string) {
  return get<ReactionSummary[]>(`/api/trips/${tripId}/reactions`);
}

export function addReaction(tripId: string, emoji: ReactionEmoji) {
  return post<ReactionDTO>(`/api/trips/${tripId}/reactions`, { emoji });
}

export function removeReaction(tripId: string, emoji: ReactionEmoji) {
  return del(`/api/trips/${tripId}/reactions`, {
    data: { emoji },
  });
}

/* ---------- Comments ---------- */

export function fetchComments(tripId: string, page = 1, pageSize = 20) {
  return get<CommentsResponse>(`/api/trips/${tripId}/comments`, {
    params: { page, pageSize },
  });
}

export function addComment(tripId: string, text: string) {
  return post<CommentDTO>(`/api/trips/${tripId}/comments`, { text });
}

export function deleteComment(tripId: string, commentId: string) {
  return del(`/api/trips/${tripId}/comments/${commentId}`);
}

/* ---------- Trip Visibility ---------- */

export function updateTripVisibility(
  tripId: string,
  visibility: TripVisibility
) {
  return patch(`/api/trips/${tripId}`, { visibility });
}
