import { QueryKeys } from "@/lib/query-keys";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

// Types
type Notification = Tables<"notifications">;

// Create a notification
export function useCreateNotification() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			userId,
			title,
			body,
			type,
			data,
		}: {
			userId: string;
			title: string;
			body: string;
			type: string;
			data?: any;
		}) => {
			const { data: notification, error } = await supabase
				.from("notifications")
				.insert({
					user_id: userId,
					title,
					body,
					type,
					data,
				})
				.select()
				.single();

			if (error) throw error;
			return notification;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QueryKeys.NOTIFICATIONS });
		},
	});
}

// Fetch user's notifications
export function useUserNotifications(userId: string) {
	return useQuery({
		queryKey: QueryKeys.NOTIFICATIONS,
		queryFn: async () => {
			const { data, error } = await supabase
				.from("notifications")
				.select("*")
				.eq("user_id", userId)
				.order("created_at", { ascending: false });

			if (error) throw error;
			return data;
		},
		enabled: !!userId,
	});
}

// Mark notification as read
export function useMarkNotificationAsRead() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (notificationId: string) => {
			const { data, error } = await supabase
				.from("notifications")
				.update({ read: true })
				.eq("id", notificationId)
				.select()
				.single();

			if (error) {
				console.error(error);
				throw error;
			}
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QueryKeys.NOTIFICATIONS });
		},
	});
}

// Helper functions for different notification types
export const notificationHelpers = {
	// Comment notification
	async createCommentNotification({
		vehicleId,
		commenterId,
		commentContent,
	}: {
		vehicleId: string;
		commenterId: string;
		commentContent: string;
	}) {
		// Get vehicle owner
		const { data: vehicle } = await supabase
			.from("vehicles")
			.select("user_id")
			.eq("vehicle_id", vehicleId)
			.single();

		if (!vehicle) return;

		// Get commenter info
		const { data: commenter } = await supabase
			.from("user_profiles")
			.select("pseudo")
			.eq("user_id", commenterId)
			.single();

		if (!commenter) return;

		// Don't notify if user is commenting on their own vehicle
		if (vehicle.user_id === commenterId) return;

		// Create notification
		await supabase.from("notifications").insert({
			user_id: vehicle.user_id,
			title: "New Comment",
			body: `${commenter.pseudo} commented on your vehicle: "${commentContent.substring(0, 50)}${commentContent.length > 50 ? "..." : ""}"`,
			type: "comment",
			data: {
				vehicleId,
				commenterId,
			},
		});
	},

	// Rating notification
	async createRatingNotification({
		vehicleId,
		raterId,
		rating,
	}: {
		vehicleId: string;
		raterId: string;
		rating: number;
	}) {
		// Get vehicle owner
		const { data: vehicle } = await supabase
			.from("vehicles")
			.select("user_id")
			.eq("vehicle_id", vehicleId)
			.single();

		if (!vehicle) return;

		// Get rater info
		const { data: rater } = await supabase
			.from("user_profiles")
			.select("pseudo")
			.eq("user_id", raterId)
			.single();

		if (!rater) return;

		// Don't notify if user is rating their own vehicle
		if (vehicle.user_id === raterId) return;

		// Create notification
		await supabase.from("notifications").insert({
			user_id: vehicle.user_id,
			title: "New Rating",
			body: `${rater.pseudo} rated your vehicle ${rating} stars`,
			type: "rating",
			data: {
				vehicleId,
				raterId,
				rating,
			},
		});
	},

	// Chat notification
	async createChatNotification({
		conversationId,
		senderId,
		messageContent,
	}: {
		conversationId: string;
		senderId: string;
		messageContent: string;
	}) {
		// Get conversation participants
		const { data: participants } = await supabase
			.from("conversation_participants")
			.select("user_id")
			.eq("conversation_id", conversationId)
			.neq("user_id", senderId);

		if (!participants) return;

		// Get sender info
		const { data: sender } = await supabase
			.from("user_profiles")
			.select("pseudo")
			.eq("user_id", senderId)
			.single();

		if (!sender) return;

		// Create notifications for all participants
		const notifications = participants.map((participant) => ({
			user_id: participant.user_id,
			title: "New Message",
			body: `${sender.pseudo} sent you a message: "${messageContent.substring(0, 50)}${messageContent.length > 50 ? "..." : ""}"`,
			type: "chat",
			data: {
				conversationId,
				senderId,
			},
		}));

		await supabase.from("notifications").insert(notifications);
	},

	// Follow notification
	async createFollowNotification({
		followerId,
		followedId,
	}: {
		followerId: string;
		followedId: string;
	}) {
		// Get follower info
		const { data: follower } = await supabase
			.from("user_profiles")
			.select("pseudo")
			.eq("user_id", followerId)
			.single();

		if (!follower) return;

		// Create notification
		await supabase.from("notifications").insert({
			user_id: followedId,
			title: "New Follower",
			body: `${follower.pseudo} started following you`,
			type: "follow",
			data: {
				followerId,
			},
		});
	},
};

export function useHasUnreadNotifications(userId: string) {
	const queryClient = useQueryClient();

	useEffect(() => {
		const channel = supabase
			.channel("notifications:read")
			.on(
				"postgres_changes",
				{
					event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
					schema: "public",
					table: "notifications",
					filter: `user_id=eq.${userId}`,
				},
				() => {
					// Invalidate the query to refresh unread status
					queryClient.invalidateQueries({
						queryKey: QueryKeys.UNREAD_NOTIFICATIONS,
					});
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [queryClient]);

	return useQuery({
		queryKey: QueryKeys.UNREAD_NOTIFICATIONS,
		queryFn: async () => {
			if (!userId) throw new Error("User not authenticated");

			const { data, error } = await supabase
				.from("notifications")
				.select("id")
				.eq("read", false)
				.eq("user_id", userId)
				.not("type", "eq", "chat")
				.limit(1);

			if (error) throw error;
			return data.length > 0;
		},
	});
}
