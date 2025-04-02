import { uploadFileToConversation } from "@/lib/helpers/upload-file";
import { QueryKeys } from "@/lib/query-keys";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import {
	type UseQueryResult,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";

// Add this at the top level of the file
let messageChannel: RealtimeChannel | null = null;
let currentConversationId: string | null = null;

// Add this helper function to update current conversation
export function setCurrentConversationId(id: string | null) {
	currentConversationId = id;
}

// Fetch all conversations for current user
export function useFetchConversations(): UseQueryResult<
	{
		id: string;
		title: string;
		unreadCount: number;
		participants: {
			pseudo: string;
			profile_picture_url: string;
			user_id: string;
		}[];
		messages: {
			id: string;
			sender_id: string;
			read: boolean;
		}[];
	}[]
> {
	const queryClient = useQueryClient();

	useEffect(() => {
		// Initialize real-time subscription
		messageChannel = supabase
			.channel("new_messages")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "messages",
				},
				async (payload) => {
					// Invalidate conversations query to refresh unread status
					queryClient.invalidateQueries({ queryKey: ["conversations"] });

					// Use the tracked conversationId instead of window.location
					const conversationId = payload.new.conversation_id;

					if (currentConversationId === conversationId) {
						await markMessageAsRead(payload.new.id);
					}
				},
			)
			.subscribe();

		// Cleanup subscription
		return () => {
			if (messageChannel) {
				supabase.removeChannel(messageChannel);
			}
		};
	}, [queryClient]);

	return useQuery({
		queryKey: QueryKeys.CONVERSATIONS,
		queryFn: async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) throw new Error("User not authenticated");

			// First, get all participants for all conversations the user is in
			const { data: userConversations } = await supabase
				.from("conversation_participants")
				.select("conversation_id")
				.eq("user_id", user.id)
				.eq("is_archived", false);

			if (!userConversations?.length) return [];

			const { data: conversationParticipants, error: participantsError } =
				await supabase
					.from("conversation_participants")
					.select(`
          conversation_id,
          user_id,
          user:user_profiles!user_id(
            pseudo,
            profile_picture_url,
            user_id
          )
        `)
					.in(
						"conversation_id",
						userConversations.map((c) => c.conversation_id),
					);

			if (participantsError) {
				throw participantsError;
			}

			// Then get the conversations
			const { data: conversations, error: convsError } = await supabase
				.from("conversations")
				.select("*")
				.in(
					"id",
					userConversations.map((c) => c.conversation_id),
				)
				.order("created_at", { ascending: false });

			if (convsError) {
				throw convsError;
			}

			// Get unread messages count for each conversation
			const { data: unreadMessages, error: unreadError } = await supabase.rpc(
				"get_unread_message_counts",
				{
					user_id: user.id,
					conversation_ids: userConversations.map((c) => c.conversation_id),
				},
			);

			if (unreadError) {
				throw unreadError;
			}

			// Create a map of conversation_id to unread count
			const unreadCountMap = new Map(
				unreadMessages?.map(
					(msg: { conversation_id: string; count: number }) => [
						msg.conversation_id,
						msg.count,
					],
				) || [],
			);

			// Combine the data including messages
			return conversations.map((conv) => ({
				...conv,
				participants: conversationParticipants
					.filter((cp) => cp.conversation_id === conv.id)
					.map((cp) => cp.user),
				unreadCount: unreadCountMap.get(conv.id) || 0,
			}));
		},
	});
}

// Fetch messages for a specific conversation
export function useFetchMessages(conversationId: string) {
	return useQuery({
		queryKey: QueryKeys.MESSAGES(conversationId),
		queryFn: async () => {
			const { data, error } = await supabase
				.from("messages")
				.select(`
          *,
          sender:user_profiles(
            user_id,
            pseudo,
            profile_picture_url
          )
        `)
				.eq("conversation_id", conversationId)
				.order("created_at", { ascending: true });

			if (error) {
				throw error;
			}
			return data;
		},
	});
}

export function useHasUnreadMessages() {
	const queryClient = useQueryClient();

	useEffect(() => {
		const channel = supabase
			.channel("unread_messages_global")
			.on(
				"postgres_changes",
				{
					event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
					schema: "public",
					table: "messages",
				},
				() => {
					// Invalidate the query to refresh unread status
					queryClient.invalidateQueries({
						queryKey: QueryKeys.UNREAD_MESSAGES,
					});
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [queryClient]);

	return useQuery({
		queryKey: QueryKeys.UNREAD_MESSAGES,
		queryFn: async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("User not authenticated");

			const { data, error } = await supabase
				.from("messages")
				.select("id")
				.eq("read", false)
				.neq("sender_id", user.id)
				.limit(1);

			if (error) throw error;
			return data.length > 0;
		},
	});
}

export function useHasUnreadMessagesInConversation(conversationId: string) {
	const queryClient = useQueryClient();

	useEffect(() => {
		const channel = supabase
			.channel(`unread_messages_${conversationId}`)
			.on(
				"postgres_changes",
				{
					event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
					schema: "public",
					table: "messages",
					filter: `conversation_id=eq.${conversationId}`,
				},
				() => {
					// Invalidate the query to refresh unread status for this conversation
					queryClient.invalidateQueries({
						queryKey: QueryKeys.UNREAD_MESSAGES_CONVERSATION(conversationId),
					});
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [conversationId, queryClient]);

	return useQuery({
		queryKey: QueryKeys.UNREAD_MESSAGES_CONVERSATION(conversationId),
		queryFn: async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("User not authenticated");

			const { data, error } = await supabase
				.from("messages")
				.select("id")
				.eq("conversation_id", conversationId)
				.eq("read", false)
				.neq("sender_id", user.id)
				.limit(1);

			if (error) throw error;

			return data.length > 0;
		},
	});
}

// Create a new conversation
export function useCreateConversation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			title,
			participantIds,
		}: {
			title?: string;
			participantIds: string[];
		}) => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("User not authenticated");

			// Check for existing conversation with the same participants
			const allParticipants = [...new Set([...participantIds, user.id])];

			// Get all conversations where the current user is a participant
			const { data: userConversations } = await supabase
				.from("conversation_participants")
				.select("conversation_id")
				.eq("user_id", user.id)
				.eq("is_archived", false);

			if (!userConversations) return null;

			// For each conversation, check if it has exactly the same participants
			for (const conv of userConversations) {
				const { data: participants } = await supabase
					.from("conversation_participants")
					.select("user_id")
					.eq("conversation_id", conv.conversation_id)
					.eq("is_archived", false);

				if (!participants) continue;

				const participantIds = participants.map((p) => p.user_id);

				// Check if the sets of participants are identical
				if (
					participantIds.length === allParticipants.length &&
					participantIds.every((id) => allParticipants.includes(id)) &&
					allParticipants.every((id) => participantIds.includes(id))
				) {
					// Return existing conversation
					const { data: existingConversation } = await supabase
						.from("conversations")
						.select()
						.eq("id", conv.conversation_id)
						.single();

					return existingConversation;
				}
			}

			// If no existing conversation found, create a new one
			const { data: conversation, error: convError } = await supabase
				.from("conversations")
				.insert({ title })
				.select()
				.single();

			if (convError) {
				throw convError;
			}

			// Add all participants
			const { error: partError } = await supabase
				.from("conversation_participants")
				.insert(
					allParticipants.map((userId) => ({
						conversation_id: conversation.id,
						user_id: userId,
					})),
				);

			if (partError) {
				throw partError;
			}

			return conversation;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		},
	});
}

// Send a message
export function useSendMessage() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			conversationId,
			content,
			attachment,
		}: {
			conversationId: string;
			content: string;
			attachment?: {
				base64: string;
				type: "pdf" | "image";
				fileName: string;
			};
		}) => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("User not authenticated");

			let attachmentUrl = null;
			if (attachment) {
				attachmentUrl = await uploadFileToConversation(
					conversationId,
					attachment.base64,
					attachment.type,
					attachment.fileName,
				);
			}

			const { data, error } = await supabase
				.from("messages")
				.insert({
					conversation_id: conversationId,
					sender_id: user.id,
					content,
					has_attachment: !!attachment,
					attachment_type: attachment?.type || null,
					attachment_url: attachmentUrl,
				})
				.select()
				.single();

			if (error) throw error;
			return data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["messages", variables.conversationId],
			});
		},
	});
}

// Archive conversation
export function useArchiveConversation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (conversationId: string) => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("User not authenticated");

			const { error } = await supabase
				.from("conversation_participants")
				.update({ is_archived: true })
				.eq("conversation_id", conversationId)
				.eq("user_id", user.id);

			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		},
	});
}

// Add this helper function to mark messages as read
async function markMessageAsRead(messageId: string) {
	const { error } = await supabase
		.from("messages")
		.update({ read: true })
		.eq("id", messageId);

	if (error) {
		console.error("Error marking message as read:", error);
	}
}

// Add this hook to mark all messages in a conversation as read
export function useMarkConversationAsRead() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (conversationId: string) => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) throw new Error("User not authenticated");

			const { error } = await supabase
				.from("messages")
				.update({ read: true })
				.eq("conversation_id", conversationId);

			if (error) {
				console.log(
					"Error marking conversation as read:",
					JSON.stringify(error, null, 2),
				);
				throw error;
			}
		},
		onSuccess: (_, conversationId) => {
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
			queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
		},
	});
}
