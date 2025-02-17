import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/supabase";
import {
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import "react-native-get-random-values";
import { decode } from "base64-arraybuffer";
import { v4 as uuidv4 } from "uuid";
import { useGetSession } from "./session";

export function useFetchUserProfile(): UseQueryResult<Tables<"user_profiles">> {
  const { data: session } = useGetSession();
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!session) throw new Error("User not authenticated");

      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error) throw error;

      return profile;
    },
    enabled: !!session,
  });
}

export function useFetchUserProfileById(
  userId: string,
): UseQueryResult<Tables<"user_profiles">> {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      return profile;
    },
  });
}
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<Tables<"user_profiles">>) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_profiles")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useUploadUserProfileMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      file,
      fileExt,
    }: { file: string; fileExt: string }) => {
      if (!file) {
        throw new Error("No file provided");
      }

      const fileUUID = uuidv4();

      const filePath = `${fileUUID}.${fileExt}`;

      const arrayBuffer = decode(file);

      try {
        const { data, error: uploadError } = await supabase.storage
          .from("profile_pictures")
          .upload(filePath, arrayBuffer, {
            contentType: `image/${fileExt}`, // Specify the correct content type
            upsert: false,
          });

        if (uploadError) {
          console.error("Error uploading file:", uploadError);
          throw uploadError;
        }

        if (!data?.path) {
          throw new Error("Upload successful but file path is missing");
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");
        const { data: userProfile, error: userProfileError } = await supabase
          .from("user_profiles")
          .update({ profile_picture_url: data.path })
          .eq("user_id", user.id)
          .select()
          .single();
        if (userProfileError) throw userProfileError;
        return userProfile;
      } catch (error) {
        console.error("Error in file upload:", error);
        throw new Error(
          `File upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    },
    onError: (error) => console.error("Error uploading file:", error),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
  });
}
