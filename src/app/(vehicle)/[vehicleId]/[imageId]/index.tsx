import { formatPicturesUri } from "@/lib/helpers/format-pictures-uri";
import { useFetchVehicleById } from "@/network/vehicles";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	Image,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function VehicleImageView() {
	const { vehicleId, imageId } = useLocalSearchParams();
	const {
		data: vehicle,
		isLoading: isVehicleLoading,
		error: vehicleError,
	} = useFetchVehicleById(vehicleId as string, "full");
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [imageLoading, setImageLoading] = useState(true);
	const [imageError, setImageError] = useState(false);
	const windowWidth = Dimensions.get("window").width;
	const windowHeight = Dimensions.get("window").height;

	useEffect(() => {
		if (vehicle?.media && vehicle.media.length > 0) {
			const imageIndex = vehicle.media.findIndex((item) => item === imageId);
			if (imageIndex !== -1) {
				setImageUrl(formatPicturesUri("vehicles", vehicle.media[imageIndex]));
			} else if (imageId) {
				setImageUrl(formatPicturesUri("vehicles", imageId as string));
			} else {
				setImageError(true);
			}
		}
	}, [vehicle, imageId]);

	if (isVehicleLoading) {
		return (
			<View className="flex-1 bg-black">
				<View className="flex-1 justify-center items-center">
					<ActivityIndicator size="large" color="#4aa8ba" />
				</View>
			</View>
		);
	}

	if (vehicleError || imageError || !imageUrl) {
		return (
			<View className="flex-1 bg-black">
				<View className="flex-1 justify-center items-center">
					<Text className="text-white text-lg mb-4">Failed to load image</Text>
					<TouchableOpacity
						onPress={() => router.back()}
						className="bg-gray-800 px-6 py-3 rounded-full"
					>
						<Text className="text-white">Go Back</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	return (
		<View className="flex-1 bg-black">
			<View className="flex-1 justify-center items-center">
				{imageLoading && (
					<ActivityIndicator size="large" color="#4aa8ba" hidesWhenStopped />
				)}
				<Image
					source={{ uri: imageUrl }}
					style={{
						width: windowWidth,
						height: windowHeight * 0.7,
						resizeMode: "contain",
					}}
					onLoad={() => setImageLoading(false)}
				/>
			</View>
		</View>
	);
}
