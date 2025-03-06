import { VehicleView } from "@/components/vehicle-details/vehicle-view";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function ViewVehicle() {
	const { vehicleId } = useLocalSearchParams();
	return (
		<View className="flex-1 bg-black relative px-2">
			<VehicleView vehicleId={vehicleId as string} />
		</View>
	);
}
