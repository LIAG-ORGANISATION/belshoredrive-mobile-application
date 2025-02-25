import { PartsDetails } from "@/components/vehicle-details/parts-detail";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { Text, View } from "react-native";

export default function ChooseBrandScreen() {
	const { vehicleId } = useLocalSearchParams();
	return (
		<View className="flex-1 bg-black relative px-2">
			<Text className="text-white text-2xl font-bold py-4">
				Donnez plus de détails sur ce véhicule
			</Text>
			<PartsDetails
				vehicleId={vehicleId as string}
				onSuccess={() => {
					router.replace("/(tabs)");
				}}
			/>
		</View>
	);
}
