import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/supabase";
import {
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// Fetch comments for a specific vehicle
export function useVehicleComments(
  vehicleId: string,
): UseQueryResult<Tables<"vehicle_comments">[]> {
  return useQuery({
    queryKey: ["vehicleComments", vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicle_comments")
        .select(`
          *,
          user_profiles:user_id (
            pseudo,
            profile_picture_url
          )
        `)
        .eq("vehicle_id", vehicleId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

// Create a new comment
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      vehicleId,
      content,
    }: {
      vehicleId: string;
      content: string;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("vehicle_comments")
        .insert({
          vehicle_id: vehicleId,
          user_id: user.id,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["vehicleComments", variables.vehicleId],
      });
    },
  });
}

// Update a comment
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => {
      const { data, error } = await supabase
        .from("vehicle_comments")
        .update({ content })
        .eq("id", commentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["vehicleComments", data.vehicle_id],
      });
    },
  });
}

// Delete a comment
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      vehicleId,
    }: {
      commentId: string;
      vehicleId: string;
    }) => {
      const { error } = await supabase
        .from("vehicle_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["vehicleComments", variables.vehicleId],
      });
    },
  });
}

// Fetch votes for a specific comment
export function useCommentVotes(commentId: string) {
  return useQuery({
    queryKey: ["commentVotes", commentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicle_comment_votes")
        .select("*")
        .eq("comment_id", commentId);

      if (error) throw error;
      return data;
    },
  });
}

// Vote on a comment
export function useVoteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      voteType,
    }: {
      commentId: string;
      voteType: "upvote" | "downvote";
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // First, try to update existing vote
      const { data: existingVote } = await supabase
        .from("vehicle_comment_votes")
        .select()
        .eq("comment_id", commentId)
        .eq("user_id", user.id)
        .single();

      if (existingVote) {
        // If vote type is the same, remove the vote
        if (existingVote.vote_type === voteType) {
          const { error } = await supabase
            .from("vehicle_comment_votes")
            .delete()
            .eq("comment_id", commentId)
            .eq("user_id", user.id);

          if (error) throw error;
          return null;
        }

        // If vote type is different, update the vote
        const { data, error } = await supabase
          .from("vehicle_comment_votes")
          .update({ vote_type: voteType })
          .eq("comment_id", commentId)
          .eq("user_id", user.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      // If no existing vote, create new vote
      const { data, error } = await supabase
        .from("vehicle_comment_votes")
        .insert({
          comment_id: commentId,
          user_id: user.id,
          vote_type: voteType,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["commentVotes", variables.commentId],
      });
    },
  });
}
