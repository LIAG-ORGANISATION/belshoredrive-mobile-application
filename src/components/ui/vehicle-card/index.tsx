import { formatPicturesUri } from "@/lib/helpers/format-pictures-uri";
import type { VehicleWithComments } from "@/network/vehicles";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

export const VehicleCard = ({ item }: { item: VehicleWithComments }) => {
	return (
		<View key={item.vehicle_id} className="rounded-2xl mb-4 relative h-[500px]">
			{!item.is_published && (
				<View className="absolute top-0 left-0 w-full px-2 py-3 bg-primary z-10 rounded-t-2xl flex-row justify-between">
					<Text className="text-white font-semibold">Brouillon</Text>
					<Pressable
						onPress={() => {
							router.replace({
								pathname: "/(create-vehicle)/[vehicleId]",
								params: { vehicleId: item.vehicle_id },
							});
						}}
					>
						<Text className="text-white font-semibold">Modifier</Text>
					</Pressable>
				</View>
			)}
			{item.media && item.media.length > 0 && (
				<Link href={item.is_published ? `/(vehicle)/${item.vehicle_id}` : `/(create-vehicle)/${item.vehicle_id}`}>
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
				</Link>
			)}
			<View className="absolute bottom-4 left-4 right-4">
				{item.nickname && (
					<Text className="text-white font-semibold">{item.nickname}</Text>
				)}
				<Text className="text-white text-lg font-bold">
					{item.year} {item.brands?.name} {item.model}
				</Text>
			</View>
		</View>
	);
};
