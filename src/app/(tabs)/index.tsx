import { CompleteProfileCta } from "@/components/ui/complete-profile-cta";
import { SkeletonVehicleCard } from "@/components/ui/skeleton-vehicle-card";
import { formatPicturesUri } from "@/lib/helpers/format-pictures-uri";
import { useVehicles } from "@/network/vehicles";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { cssInterop } from "nativewind";
import { FlatList, Image, RefreshControl, Text, View } from "react-native";

cssInterop(LinearGradient, {
	className: {
		target: "style",
	},
});

export default function TabOneScreen() {
	const { isProfileComplete } = useLocalSearchParams();

	const {
		data: vehiclesPages,
		isLoading,
		error,
		fetchNextPage,
		refetch,
		isFetching,
	} = useVehicles();

	if (isLoading) {
		return (
			<View className="flex-1 bg-black text-white mt-5">
				{isProfileComplete !== "true" && (
					<CompleteProfileCta step={isProfileComplete as string} />
				)}
				<FlatList
					data={[1, 2, 3]} // Show 3 skeleton items
					className={`w-full ${isProfileComplete ? "mt-0" : "mt-3"}`}
					renderItem={() => <SkeletonVehicleCard />}
					keyExtractor={(_, index) => `skeleton-${index}`}
				/>
			</View>
		);
	}

	if (error) {
		return (
			<View className="flex-1 items-center justify-center bg-black">
				<Text className="text-white">Error: {error.message}</Text>
			</View>
		);
	}

	// Flatten the pages array into a single array of vehicles
	const vehicles = vehiclesPages?.pages.flat() ?? [];

	return (
		<View className="flex-1 items-center justify-start bg-black text-white mt-5">
			{isProfileComplete !== "true" && (
				<CompleteProfileCta step={isProfileComplete as string} />
			)}

			<FlatList
				data={vehicles}
				className={`w-full ${isProfileComplete ? "mt-0" : "mt-3"}`}
				refreshControl={
					<RefreshControl
						refreshing={isFetching}
						onRefresh={refetch}
						tintColor="white"
					/>
				}
				renderItem={({ item }) => (
					<View className="rounded-2xl mb-4 relative h-[500px]">
						{item.media && item.media.length > 0 && (
							<>
								<Image
									source={{
										uri: formatPicturesUri("vehicles", item.media[0]),
									}}
									className="w-full h-full rounded-2xl"
									resizeMode="cover"
								/>
								<LinearGradient
									colors={["transparent", "rgba(0,0,0,0.8)"]}
									className="absolute bottom-0 w-full h-1/3 rounded-b-lg"
								/>
							</>
						)}
						<View className="absolute bottom-4 left-4 right-4">
							{item.nickname && (
								<Text className="text-white font-semibold">
									{item.nickname}
								</Text>
							)}
							<Text className="text-white text-lg font-bold">
								{item.year} {item.brands?.name} {item.model}
							</Text>

							{/* Add owner information */}
							<View className="flex-row items-center mt-4">
								{item.user_profiles?.profile_picture_url && (
									<Image
										source={{
											uri: formatPicturesUri(
												"profile_pictures",
												item.user_profiles.profile_picture_url,
											),
										}}
										className="w-6 h-6 rounded-full mr-2"
									/>
								)}
								<Text className="text-white text-sm">
									{item.user_profiles?.pseudo || "Unknown User"}
								</Text>
							</View>
						</View>
					</View>
				)}
				keyExtractor={(item) => item.vehicle_id}
				onEndReached={() => fetchNextPage()}
				onEndReachedThreshold={0.5}
			/>
		</View>
	);
}
