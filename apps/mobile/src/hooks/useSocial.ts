import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  searchUsers,
  fetchUserProfile,
  sendFriendRequest,
  fetchPendingRequests,
  respondToFriendRequest,
  fetchFriends,
} from "@/api/social";

const SOCIAL_KEYS = {
  search: (q: string, page: number) => ["users", "search", q, page] as const,
  profile: (id: string) => ["users", "profile", id] as const,
  pendingRequests: ["friends", "requests"] as const,
  friends: ["friends", "list"] as const,
};

export function useSearchUsers(query: string, page = 1) {
  return useQuery({
    queryKey: SOCIAL_KEYS.search(query, page),
    queryFn: () => searchUsers(query, page),
    enabled: query.length >= 2,
    staleTime: 30_000,
  });
}

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: SOCIAL_KEYS.profile(userId),
    queryFn: () => fetchUserProfile(userId),
    enabled: Boolean(userId),
    staleTime: 60_000,
  });
}

export function usePendingRequests() {
  return useQuery({
    queryKey: SOCIAL_KEYS.pendingRequests,
    queryFn: fetchPendingRequests,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function useFriends() {
  return useQuery({
    queryKey: SOCIAL_KEYS.friends,
    queryFn: fetchFriends,
    staleTime: 5 * 60_000,
  });
}

export function useSendFriendRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (toUserId: string) => sendFriendRequest(toUserId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: SOCIAL_KEYS.pendingRequests });
      void qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useRespondToRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      action,
    }: {
      requestId: string;
      action: "accept" | "decline";
    }) => respondToFriendRequest(requestId, action),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: SOCIAL_KEYS.pendingRequests });
      void qc.invalidateQueries({ queryKey: SOCIAL_KEYS.friends });
      void qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
