import { supabase } from "@/lib/supabase";
import {
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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
  }[]
> {
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

      // Combine the data
      return conversations.map((conv) => ({
        ...conv,
        participants: conversationParticipants
          .filter((cp) => cp.conversation_id === conv.id)
          .map((cp) => cp.user),
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
