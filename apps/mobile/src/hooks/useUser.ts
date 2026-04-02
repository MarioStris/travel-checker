import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateProfileInput } from "@travel-checker/shared/src/types";
import { fetchCurrentUser, fetchUserStats, updateProfile } from "@/api/users";

export const USER_KEYS = {
  me: ["user", "me"] as const,
  stats: ["user", "stats"] as const,
};

export function useCurrentUser() {
  return useQuery({
    queryKey: USER_KEYS.me,
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 10,
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: USER_KEYS.stats,
    queryFn: fetchUserStats,
    staleTime: 1000 * 60 * 10,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfile(input),
    onSuccess: (data) => {
      queryClient.setQueryData(USER_KEYS.me, data);
    },
  });
}
