import { QueryKeys } from "@/lib/query-keys";
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
import { v4 as uuidv4 } from "uuid";
import { notificationHelpers } from "./notifications";
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

export type UserVehicleWithComments = {
	publishedVehicles: VehicleWithComments[];
	draftsVehicle: VehicleWithComments[];
};

const COMMENTS_PER_PAGE = 10;

// Type for paginated comments
export type PaginatedComments = {
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
		queryKey: QueryKeys.VEHICLE_COMMENTS(vehicleId, page),
		queryFn: async (): Promise<PaginatedComments> => {
			// First, get total count of comments
			const { count, error: countError } = await supabase
				.from("vehicle_comments")
				.select("*", { count: "exact", head: true })
				.eq("vehicle_id", vehicleId);

			if (countError) {
				console.error("error --------> ", countError);
				throw countError;
			}

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

			if (error) {
				console.error("error --------> ", error);
				throw error;
			}

			return {
				data: data,
				count: count || 0,
			};
		},
		enabled: !!vehicleId,
	});
}

// Modified useVehicle hook to work with useVehicleComments
export function useVehicle(
	vehicleId: string,
): UseQueryResult<Omit<VehicleWithComments, "vehicle_comments">> {
	return useQuery({
		queryKey: QueryKeys.VEHICLE(vehicleId),
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
		queryKey: QueryKeys.VEHICLES,
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
          ),
			vehicle_ratings (
				rating
			)
        `)
				.eq("is_published", true)
				.range(pageParam * 10, (pageParam + 1) * 10 - 1)
				.order("created_at", { ascending: false });

			if (error) {
				console.error(JSON.stringify(error, null, 2));
				throw error;
			}
			if (data.length > 0) {
				for (const vehicle of data) {
					if (vehicle.vehicle_ratings.length > 0) {
						const ratings = vehicle.vehicle_ratings
							.map((r) => r.rating)
							.filter((r): r is number => r !== null);
						const average = ratings.length
							? ratings.reduce((a, b) => a + b, 0) / ratings.length
							: 0;
						vehicle.rating = average;
					}
				}
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
export function useUserVehicles<
	T extends "VehicleWithComments" | "UserVehicleWithComments",
>(
	userId: string,
	showDraftVehicles: boolean,
): UseQueryResult<
	T extends "VehicleWithComments"
		? VehicleWithComments[]
		: UserVehicleWithComments
> {
	return useQuery({
		queryKey: QueryKeys.USER_VEHICLES(userId),
		enabled: !!userId,
		queryFn: async () => {
			const query = supabase
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
				.order("created_at", { ascending: false })
				.eq("is_published", true);

			const draftQuery = supabase
				.from("vehicles")
				.select(`
          *,
          brands (
            name
          )
        `)
				.eq("user_id", userId)
				.order("created_at", { ascending: false })
				.eq("is_published", false);

			const { data: publishedData, error: publishedError } = await query;

			if (showDraftVehicles) {
				const { data: draftData, error: draftError } = await draftQuery;

				if (publishedError || draftError) throw publishedError || draftError;

				return {
					publishedVehicles: publishedData || [],
					draftsVehicle: draftData || [],
				} as UserVehicleWithComments;
			}

			if (publishedError) throw publishedError;

			return {
				publishedVehicles: publishedData as VehicleWithComments[],
				draftsVehicle: [],
			} as UserVehicleWithComments;
		},
	});
}

// Create a new vehicle
export function useCreateVehicle() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			vehicleData: Partial<Omit<Tables<"vehicles">, "vehicle_id" | "user_id">>,
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

			if (error) throw new Error(error.message);

			if (data) {
				return data;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QueryKeys.VEHICLES });
			queryClient.invalidateQueries({ queryKey: QueryKeys.USER_VEHICLES });
		},
	});
}

//fetch Vehicle by id
export function useFetchVehicleById(
	vehicleId: string,
	levelOfDetails: "full" | "minimal" = "minimal",
): UseQueryResult<Tables<"vehicles">> {
	return useQuery({
		queryKey: QueryKeys.VEHICLE(vehicleId),
		queryFn: async () => {
			const query =
				levelOfDetails === "minimal"
					? `
						*,
						brands (
							*
						),
						vehicle_statuses (
							*
						)
					`
					: `
						*,
						brands (*),
						vehicle_statuses (*),
						user_profiles (*),
						motorization_types (*),
						transmission_types (*)
					`;
			const { data, error } = await supabase
				.from("vehicles")
				.select(query)
				.eq("vehicle_id", vehicleId)
				.single();
			if (error) {
				console.error("error --------> ", error);
				throw error;
			}
			return data;
		},
		enabled: !!vehicleId,
	});
}

// fetch vehicules statuses
export function useFetchVehicleStatuses() {
	return useQuery({
		queryKey: QueryKeys.VEHICLE_STATUSES,
		queryFn: async () => {
			const { data, error } = await supabase
				.from("vehicle_statuses")
				.select("*");
			if (error) throw error;
			return data;
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
				.update({ ...updates })
				.eq("vehicle_id", vehicleId)
				.select()
				.single();

			if (error) {
				console.error("error --------> ", error);
				throw error;
			}

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: QueryKeys.VEHICLE(data.vehicle_id),
			});
			queryClient.invalidateQueries({ queryKey: QueryKeys.VEHICLES });
			queryClient.invalidateQueries({ queryKey: QueryKeys.USER_VEHICLES });
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
			queryClient.invalidateQueries({ queryKey: QueryKeys.VEHICLES });
			queryClient.invalidateQueries({ queryKey: QueryKeys.USER_VEHICLES });
		},
	});
}

// Search vehicles (will be replaced with Algolia)
export function useSearchVehicles(query: string) {
	return useQuery({
		queryKey: QueryKeys.VEHICLE_SEARCH(query),
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
		queryKey: QueryKeys.VEHICLE_RATING(vehicleId),
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
		onSuccess: async (_, variables) => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("User not authenticated");

			await notificationHelpers.createRatingNotification({
				vehicleId: variables.vehicleId,
				raterId: user.id,
				rating: variables.rating,
			});

			queryClient.invalidateQueries({
				queryKey: QueryKeys.VEHICLE_RATING(variables.vehicleId),
			});
		},
	});
}

// Get vehicle rating by user
export function useVehicleRatingByUser(vehicleId: string) {
	return useQuery({
		queryKey: QueryKeys.VEHICLE_RATING_BY_USER(vehicleId),
		queryFn: async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("User not authenticated");

			const { data, error } = await supabase
				.from("vehicle_ratings")
				.select("rating")
				.eq("vehicle_id", vehicleId)
				.eq("user_id", user.id)
				.single();

			if (error) throw error;
			return data;
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

				const fileUUID = uuidv4();
				const filePath = `${fileUUID}.${ext}`;

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
			queryClient.invalidateQueries({ queryKey: QueryKeys.VEHICLES });
		},
	});
}

export function useDeleteVehicleMedia() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			mediaUUID,
			vehicleId,
		}: { mediaUUID: string; vehicleId: string }) => {
			const { error } = await supabase.storage
				.from("vehicles")
				.remove([`${mediaUUID}`]);

			if (error) throw error;
			const { data: vehicle } = await supabase
				.from("vehicles")
				.select("media")
				.eq("vehicle_id", vehicleId)
				.single();

			if (vehicle?.media) {
				const updatedMedia = vehicle.media.filter(
					(media: string) => media !== mediaUUID,
				);

				const { error: updateError } = await supabase
					.from("vehicles")
					.update({ media: updatedMedia })
					.eq("vehicle_id", vehicleId);

				if (updateError) throw updateError;
			}

			return { success: true };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QueryKeys.VEHICLES });
		},
	});
}

export type TagsType = {
	tag_id: string;
	created_id: string;
	type_id: string;
	name: string;
};

export function useFetchVehicleTags(vehicleId: string) {
	return useQuery({
		queryKey: QueryKeys.VEHICLE_TAGS,
		queryFn: async () => {
			const { data: vehicle, error: vehicleError } = await supabase
				.from("vehicles")
				.select("*, brands(*, vehicle_types(*))")
				.eq("vehicle_id", vehicleId)
				.single();

			if (vehicleError) throw vehicleError;

			const { data, error } = await supabase
				.from("tags")
				.select("*")
				.eq("type_id", vehicle?.brands.type_id);
			if (error) {
				console.error("error --------> ", error);
				throw error;
			}
			return data;
		},
	});
}

export function useFetchMotorizationTypes(typeId: string) {
	return useQuery({
		queryKey: QueryKeys.MOTORIZATION_TYPES,
		queryFn: async () => {
			const { data, error } = await supabase
				.from("motorization_types")
				.select("*")
				.eq("type_id", typeId);
			if (error) throw error;
			return data;
		},
	});
}

export function useFetchTransmissionTypes(typeId: string) {
	return useQuery({
		queryKey: QueryKeys.TRANSMISSION_TYPES,
		queryFn: async () => {
			const { data, error } = await supabase
				.from("transmission_types")
				.select("*")
				.eq("type_id", typeId);
			if (error) throw error;
			return data;
		},
	});
}

export function useFetchVehicleTypes(
	setType?: React.Dispatch<React.SetStateAction<string | undefined>>,
): UseQueryResult<Tables<"vehicle_types">[]> {
	return useQuery({
		queryKey: QueryKeys.VEHICLE_TYPES,
		queryFn: async () => {
			const { data, error } = await supabase.from("vehicle_types").select("*");

			if (error) {
				console.error("error --------> ", error);
				throw error;
			}
			if (setType) {
				setType(data[0].id);
			}

			return data;
		},
	});
}

export function useFetchVehicleTagsDetails(tagsIds: string[]) {
	return useQuery({
		queryKey: QueryKeys.VEHICLE_TAGS_DETAILS,
		queryFn: async () => {
			const { data, error } = await supabase
				.from("tags")
				.select("*")
				.in("tag_id", tagsIds);
			if (error) throw error;
			return data;
		},
		enabled: tagsIds.length > 0,
	});
}

export function useFetchTypes() {
	return useQuery({
		queryKey: QueryKeys.TYPES,
		queryFn: async () => {
			const { data, error } = await supabase.from("vehicle_types").select("*");
			if (error) throw error;
			return data;
		},
	});
}
