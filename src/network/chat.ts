import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Fetch all conversations for current user
export function useFetchConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          conversation_participants!inner(*)
        `)
        .eq("conversation_participants.user_id", user.id)
        .eq("conversation_participants.is_archived", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
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
          sender:user_profiles(*)
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
