import { VehicleDetails } from "@/components/vehicle-details/vehicle-details";
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
			<VehicleDetails
				vehicleId={vehicleId as string}
				onSuccess={() => {
					router.push({
						pathname: "/create-vehicle/[vehicleId]/parts-details",
						params: { vehicleId: vehicleId as string },
					});
				}}
			/>
		</View>
	);
}
