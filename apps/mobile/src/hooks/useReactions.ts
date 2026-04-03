import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchReactions,
  addReaction,
  removeReaction,
  fetchComments,
  addComment,
  deleteComment,
} from "@/api/social";
import type { ReactionEmoji } from "@/types/social";

const REACTION_KEYS = {
  reactions: (tripId: string) => ["trips", tripId, "reactions"] as const,
  comments: (tripId: string, page: number) =>
    ["trips", tripId, "comments", page] as const,
};

export function useReactions(tripId: string) {
  return useQuery({
    queryKey: REACTION_KEYS.reactions(tripId),
    queryFn: () => fetchReactions(tripId),
    enabled: Boolean(tripId),
    staleTime: 30_000,
  });
}

export function useToggleReaction(tripId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      emoji,
      reacted,
    }: {
      emoji: ReactionEmoji;
      reacted: boolean;
    }) => (reacted ? removeReaction(tripId, emoji) : addReaction(tripId, emoji)),
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: REACTION_KEYS.reactions(tripId),
      });
    },
  });
}

export function useComments(tripId: string, page = 1) {
  return useQuery({
    queryKey: REACTION_KEYS.comments(tripId, page),
    queryFn: () => fetchComments(tripId, page),
    enabled: Boolean(tripId),
    staleTime: 30_000,
  });
}

export function useAddComment(tripId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => addComment(tripId, text),
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: ["trips", tripId, "comments"],
      });
    },
  });
}

export function useDeleteComment(tripId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(tripId, commentId),
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: ["trips", tripId, "comments"],
      });
    },
  });
}
