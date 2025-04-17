import { SkeletonGrid } from "@/components/ui/skeleton-grid";
import { formatPicturesUri } from "@/lib/helpers/format-pictures-uri";
import { useFetchVehicleById } from "@/network/vehicles";
import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Gallery() {
	const { vehicleId } = useLocalSearchParams();
	const { data: vehicle, isLoading } = useFetchVehicleById(
		vehicleId as string,
		"full",
	);
	const renderVehicle = ({ item }: { item: string }) => (
		<TouchableOpacity
			className="w-full aspect-square p-0.5"
			onPress={() => {
				router.push({
					pathname: "/(create-vehicle)/[vehicleId]/[imageId]",
					params: {
						vehicleId: vehicleId as string,
						imageId: item as string,
					},
				});
			}}
		>
			<View className="w-full h-full overflow-hidden bg-gray-800">
				{item ? (
					<Image
						source={{
							uri: formatPicturesUri("vehicles", item),
						}}
						className="w-full h-full"
						resizeMode="cover"
					/>
				) : (
					<View className="w-full h-full items-center justify-center">
						<Text className="text-gray-400">No Image</Text>
					</View>
				)}
			</View>
		</TouchableOpacity>
	);
	if (isLoading || !vehicle) return null;
	return (
		<View className="flex-1 bg-black ">
			{isLoading || !vehicle ? (
				<View className="flex-1 bg-black mt-4">
					<SkeletonGrid items={12} />
				</View>
			) : (
				<FlashList
					data={vehicle?.media}
					renderItem={renderVehicle}
					numColumns={3}
					estimatedItemSize={150}
					className="flex-1 mt-4"
					contentContainerStyle={{ paddingBottom: 20 }}
				/>
			)}
		</View>
	);
}
