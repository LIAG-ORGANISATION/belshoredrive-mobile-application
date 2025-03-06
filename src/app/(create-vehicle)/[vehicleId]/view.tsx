import { VehicleViewEdit } from "@/components/vehicle-details/vehicle-view-edit";
import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ViewVehicle() {
	const { vehicleId } = useLocalSearchParams();
	return (
		<View className="flex-1 bg-black relative px-2">
			<View className="absolute top-0 left-0 w-screen bg-primary p-2 mb-3 z-10">
				<Text className="text-white text-sm font-bold ">
					Mode aperçu · Vérifiez toutes les informations et publiez
				</Text>
			</View>
			<VehicleViewEdit
				vehicleId={vehicleId as string}
				className="mt-12"
				onSuccess={() => {
					router.push({
						pathname: "/(tabs)",
					});
				}}
			/>
		</View>
	);
}
