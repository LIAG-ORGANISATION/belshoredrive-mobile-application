import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/supabase";
import {
	type UseQueryResult,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";

type FollowerResult = Tables<"user_follows"> & {
	user_profiles: {
		user_id: string;
		pseudo: string;
		profile_picture_url: string | null;
	};
};

// Fetch followers for a user
export function useUserFollowers(
	userId: string,
): UseQueryResult<FollowerResult[]> {
	return useQuery({
		queryKey: ["followers", userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("user_follows")
				.select(`
          followed_at,
          follower_id,
          user_profiles!user_follows_follower_id_fkey1 (
            user_id,
            pseudo,
            profile_picture_url
          )
        `)
				.eq("followee_id", userId);

			if (error) throw error;

			return data;
		},
		enabled: !!userId,
	});
}

type FollowingResult = Tables<"user_follows"> & {
	user_profiles: {
		user_id: string;
		pseudo: string;
		profile_picture_url: string | null;
	};
};

// Fetch users that a user follows
export function useUserFollowing(
	userId: string,
): UseQueryResult<FollowingResult[]> {
	return useQuery({
		queryKey: ["following", userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("user_follows")
				.select(`
          followed_at,
          followee_id,
          user_profiles!user_follows_followee_id_fkey1 (
            user_id,
            pseudo,
            profile_picture_url
          )
        `)
				.eq("follower_id", userId);

			if (error) throw error;
			return data;
		},
	});
}

// Check if current user follows a specific user
export function useIsFollowing(targetUserId: string) {
	return useQuery({
		queryKey: ["isFollowing", targetUserId],
		queryFn: async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("User not authenticated");

			const { data, error } = await supabase
				.from("user_follows")
				.select("*")
				.eq("follower_id", user.id)
				.eq("followee_id", targetUserId)
				.single();

			if (error && error.code !== "PGRST116") throw error;
			return !!data;
		},
	});
}

// Follow a user
export function useFollowUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (targetUserId: string) => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("User not authenticated");

			const { data, error } = await supabase
				.from("user_follows")
				.insert({
					follower_id: user.id,
					followee_id: targetUserId,
					followed_at: new Date().toISOString(),
				})
				.select()
				.single();

			if (error) throw error;
			return data;
		},
		onSuccess: (_, targetUserId) => {
			queryClient.invalidateQueries({ queryKey: ["followers", targetUserId] });
			queryClient.invalidateQueries({ queryKey: ["following"] });
			queryClient.invalidateQueries({
				queryKey: ["isFollowing", targetUserId],
			});
		},
	});
}

// Unfollow a user
export function useUnfollowUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (targetUserId: string) => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("User not authenticated");

			const { error } = await supabase
				.from("user_follows")
				.delete()
				.eq("follower_id", user.id)
				.eq("followee_id", targetUserId);

			if (error) throw error;
		},
		onSuccess: (_, targetUserId) => {
			queryClient.invalidateQueries({ queryKey: ["followers", targetUserId] });
			queryClient.invalidateQueries({ queryKey: ["following"] });
			queryClient.invalidateQueries({
				queryKey: ["isFollowing", targetUserId],
			});
		},
	});
}

// Get followers count for a user
export function useFollowersCount(userId: string) {
	return useQuery({
		queryKey: ["followersCount", userId],
		queryFn: async () => {
			const { count, error } = await supabase
				.from("user_follows")
				.select("*", { count: "exact", head: true })
				.eq("followee_id", userId);

			if (error) throw error;
			return count || 0;
		},
	});
}

// Get following count for a user
export function useFollowingCount(userId: string) {
	return useQuery({
		queryKey: ["followingCount", userId],
		queryFn: async () => {
			const { count, error } = await supabase
				.from("user_follows")
				.select("*", { count: "exact", head: true })
				.eq("follower_id", userId);

			if (error) throw error;
			return count || 0;
		},
	});
}
