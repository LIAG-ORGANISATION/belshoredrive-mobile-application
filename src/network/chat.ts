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

// Fetch all conversations for current user
export function useFetchConversations(): UseQueryResult<
  {
    id: string;
    title: string;
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

          // If we're currently viewing the conversation, mark as read
          const conversationId = payload.new.conversation_id;
          if (window.location.pathname.includes(conversationId)) {
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
    queryKey: ["conversations"],
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
        console.log(JSON.stringify(participantsError, null, 2));
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
        console.log(JSON.stringify(convsError, null, 2));
        throw convsError;
      }

      // Add messages to the query
      const { data: messages, error: messagesError } = await supabase
        .from("messages")
        .select("id, sender_id, read")
        .in(
          "conversation_id",
          userConversations.map((c) => c.conversation_id),
        );

      if (messagesError) throw messagesError;

      // Combine the data including messages
      return conversations.map((conv) => ({
        ...conv,
        participants: conversationParticipants
          .filter((cp) => cp.conversation_id === conv.id)
          .map((cp) => cp.user),
        messages: messages.filter((msg) => msg.conversation_id === conv.id),
      }));
    },
  });
}

// Fetch messages for a specific conversation
export function useFetchMessages(conversationId: string) {
  return useQuery({
    queryKey: ["messages", conversationId],
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
        console.error("Error fetching messages:", error);
        throw error;
      }

      return data;
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

      // Create conversation
      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .insert({ title })
        .select()
        .single();

      if (convError) {
        console.log(JSON.stringify(convError, null, 2));
        throw convError;
      }

      // Add all participants (including the creator)
      const allParticipants = [...new Set([...participantIds, user.id])];
      const { error: partError } = await supabase
        .from("conversation_participants")
        .insert(
          allParticipants.map((userId) => ({
            conversation_id: conversation.id,
            user_id: userId,
          })),
        );

      if (partError) {
        console.log(JSON.stringify(partError, null, 2));
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
    }: {
      conversationId: string;
      content: string;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content,
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
        .eq("conversation_id", conversationId)
        .neq("sender_id", user.id);

      console.log("conversationId", conversationId);

      if (error) {
        console.error(
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
