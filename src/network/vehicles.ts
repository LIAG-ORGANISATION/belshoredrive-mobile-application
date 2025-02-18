import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/supabase";
import {
	type UseQueryResult,
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { decode } from "base64-arraybuffer";
// Types
export type VehicleWithComments = Tables<"vehicles"> & {
	vehicle_comments: (Tables<"vehicle_comments"> & {
		user_profiles: Pick<
			Tables<"user_profiles">,
			"pseudo" | "profile_picture_url"
		>;
	})[];
	user_profiles: Pick<
		Tables<"user_profiles">,
		"pseudo" | "profile_picture_url"
	> | null;
	brands: Pick<Tables<"brands">, "name"> | null;
};

const COMMENTS_PER_PAGE = 10;

// Type for paginated comments
type PaginatedComments = {
	data: (Tables<"vehicle_comments"> & {
		user_profiles: Pick<
			Tables<"user_profiles">,
			"pseudo" | "profile_picture_url"
		>;
	})[];
	count: number;
};

// Separate hook for fetching paginated comments
export function useVehicleComments(vehicleId: string, page = 0) {
	return useQuery({
		queryKey: ["vehicleComments", vehicleId, page],
		queryFn: async (): Promise<PaginatedComments> => {
			// First, get total count of comments
			const { count, error: countError } = await supabase
				.from("vehicle_comments")
				.select("*", { count: "exact", head: true })
				.eq("vehicle_id", vehicleId);

			if (countError) throw countError;

			// Then get paginated comments
			const { data, error } = await supabase
				.from("vehicle_comments")
				.select(`
          *,
          user_profiles (
            pseudo,
            profile_picture_url
          )
        `)
				.eq("vehicle_id", vehicleId)
				.order("created_at", { ascending: false })
				.range(page * COMMENTS_PER_PAGE, (page + 1) * COMMENTS_PER_PAGE - 1);

			if (error) throw error;

			return {
				data: data,
				count: count || 0,
			};
		},
	});
}

// Modified useVehicle hook to work with useVehicleComments
export function useVehicle(
	vehicleId: string,
): UseQueryResult<Omit<VehicleWithComments, "vehicle_comments">> {
	return useQuery({
		queryKey: ["vehicle", vehicleId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("vehicles")
				.select(`
          *,
          brands (
            name
          ),
          user_profiles (
            pseudo,
            profile_picture_url
          )
        `)
				.eq("vehicle_id", vehicleId)
				.single();

			if (error) throw error;
			return data;
		},
	});
}

// Fetch all vehicles with pagination
export function useVehicles() {
	return useInfiniteQuery({
		queryKey: ["vehicles"],
		initialPageParam: 0,
		queryFn: async ({ pageParam = 0 }) => {
			const { data, error } = await supabase
				.from("vehicles")
				.select(`
          *,
          brands (*),
          user_profiles!user_id (
            pseudo,
            profile_picture_url
          )
        `)
				.range(pageParam * 10, (pageParam + 1) * 10 - 1)
				.order("created_at", { ascending: false });

			if (error) {
				console.error(JSON.stringify(error, null, 2));
				throw error;
			}
			return data;
		},
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage?.length) return undefined;
			return allPages.length;
		},
	});
}

// Fetch vehicles by user
export function useUserVehicles(
	userId: string,
): UseQueryResult<VehicleWithComments[]> {
	return useQuery({
		queryKey: ["userVehicles", userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("vehicles")
				.select(`
          *,
          brands (
            name
          ),
          vehicle_comments (
            count
          )
        `)
				.eq("user_id", userId)
				.order("created_at", { ascending: false });

			if (error) throw error;
			return data;
		},
	});
}

// Create a new vehicle
export function useCreateVehicle() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			vehicleData: Omit<Tables<"vehicles">, "vehicle_id" | "user_id">,
		) => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("User not authenticated");

			const { data, error } = await supabase
				.from("vehicles")
				.insert({ ...vehicleData, user_id: user.id })
				.select()
				.single();

			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["vehicles"] });
			queryClient.invalidateQueries({ queryKey: ["userVehicles"] });
		},
	});
}

// Update a vehicle
export function useUpdateVehicle() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			vehicleId,
			updates,
		}: {
			vehicleId: string;
			updates: Partial<Tables<"vehicles">>;
		}) => {
			const { data, error } = await supabase
				.from("vehicles")
				.update(updates)
				.eq("vehicle_id", vehicleId)
				.select()
				.single();

			if (error) throw error;
			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["vehicle", data.vehicle_id] });
			queryClient.invalidateQueries({ queryKey: ["vehicles"] });
			queryClient.invalidateQueries({ queryKey: ["userVehicles"] });
		},
	});
}

// Delete a vehicle
export function useDeleteVehicle() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (vehicleId: string) => {
			const { error } = await supabase
				.from("vehicles")
				.delete()
				.eq("vehicle_id", vehicleId);

			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["vehicles"] });
			queryClient.invalidateQueries({ queryKey: ["userVehicles"] });
		},
	});
}

// Search vehicles (will be replaced with Algolia)
export function useSearchVehicles(query: string) {
	return useQuery({
		queryKey: ["vehicleSearch", query],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("vehicles")
				.select(`
          *,
          brands (
            name
          ),
          user_profiles (
            pseudo,
            profile_picture_url
          )
        `)
				.or(`
          model.ilike.%${query}%,
          nickname.ilike.%${query}%,
          brands.name.ilike.%${query}%
        `)
				.order("created_at", { ascending: false });

			if (error) throw error;
			return data;
		},
		enabled: query.length > 0,
	});
}

// Get vehicle ratings
// TODO: The average should be computed on Supabase
export function useVehicleRating(vehicleId: string) {
	return useQuery({
		queryKey: ["vehicleRating", vehicleId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("vehicle_ratings")
				.select("rating")
				.eq("vehicle_id", vehicleId);

			if (error) throw error;

			// Calculate average rating
			const ratings = data
				.map((r) => r.rating)
				.filter((r): r is number => r !== null);
			const average = ratings.length
				? ratings.reduce((a, b) => a + b, 0) / ratings.length
				: 0;

			return {
				average,
				count: ratings.length,
			};
		},
	});
}

// Rate a vehicle
export function useRateVehicle() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			vehicleId,
			rating,
		}: {
			vehicleId: string;
			rating: number;
		}) => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("User not authenticated");

			const { data, error } = await supabase
				.from("vehicle_ratings")
				.upsert(
					{
						vehicle_id: vehicleId,
						user_id: user.id,
						rating,
					},
					{ onConflict: "vehicle_id,user_id" },
				)
				.select()
				.single();

			if (error) throw error;
			return data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["vehicleRating", variables.vehicleId],
			});
		},
	});
}

export function useUploadVehicleMedia() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (files: { base64: string; fileExt: string }[]) => {
			const mediaUUIDs: string[] = [];

			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const ext = file.fileExt;

				if (!file) {
					console.error("No file provided");
					continue;
				}

				const fileUUID = crypto.randomUUID();
				const filePath = `vehicle-media/${fileUUID}.${ext}`;

				try {
					const arrayBuffer = decode(file.base64);

					const { data, error: uploadError } = await supabase.storage
						.from("vehicles")
						.upload(filePath, arrayBuffer, {
							contentType: `image/${ext}`,
							upsert: false,
						});

					if (uploadError) {
						console.error("Error uploading file:", uploadError);
						continue;
					}

					if (!data?.path) {
						console.error("Upload successful but file path is missing");
						continue;
					}

					mediaUUIDs.push(data.path);
				} catch (error) {
					console.error("Error in file upload:", error);
				}
			}

			return mediaUUIDs;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["vehicles"] });
		},
	});
}

export function useDeleteVehicleMedia() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (mediaUUID: string) => {
			const { error } = await supabase.storage
				.from("vehicles")
				.remove([`vehicle-media/${mediaUUID}`]);

			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["vehicles"] });
		},
	});
}
