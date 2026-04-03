import type { TripDTO, UserDTO } from "@travel-checker/shared/src/types";

/* ---------- Visibility ---------- */

export type TripVisibility = "public" | "network" | "private";

/* ---------- User Search ---------- */

export interface UserSearchResult {
  id: string;
  displayName: string;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  tripsCount: number;
  countriesCount: number;
  friendStatus: FriendStatus;
}

export type FriendStatus =
  | "none"
  | "pending_sent"
  | "pending_received"
  | "accepted";

export interface UserSearchResponse {
  users: UserSearchResult[];
  total: number;
  page: number;
  pageSize: number;
}

/* ---------- User Profile ---------- */

export interface UserProfileDTO extends UserDTO {
  friendStatus: FriendStatus;
  mutualFriends: number;
  publicTrips: TripDTO[];
}

/* ---------- Friend Requests ---------- */

export interface FriendRequestDTO {
  id: string;
  fromUser: {
    id: string;
    displayName: string;
    username: string | null;
    avatarUrl: string | null;
  };
  toUser: {
    id: string;
    displayName: string;
    username: string | null;
    avatarUrl: string | null;
  };
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

/* ---------- Reactions ---------- */

export type ReactionEmoji = "❤️" | "🔥" | "😍" | "🙌" | "✈️" | "🌍";

export const REACTION_EMOJIS: ReactionEmoji[] = [
  "❤️", "🔥", "😍", "🙌", "✈️", "🌍",
];

export interface ReactionDTO {
  id: string;
  tripId: string;
  userId: string;
  emoji: ReactionEmoji;
  user: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
  createdAt: string;
}

export interface ReactionSummary {
  emoji: ReactionEmoji;
  count: number;
  reacted: boolean;
}

/* ---------- Comments ---------- */

export interface CommentDTO {
  id: string;
  tripId: string;
  userId: string;
  text: string;
  user: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
  createdAt: string;
}

export interface CommentsResponse {
  comments: CommentDTO[];
  total: number;
  page: number;
  pageSize: number;
}
