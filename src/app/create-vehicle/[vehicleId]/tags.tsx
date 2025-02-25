import { SelectTags } from "@/components/vehicle-details/select-tags";
import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function CreateVehicleDetails() {
	const { vehicleId } = useLocalSearchParams();
	return (
		<View className="flex-1 bg-black relative px-2">
			<SelectTags
				title="Ajouter des tags"
				subtitle="Les tags permettent aux passionnés de trouver votre véhicule plus facilement en fonction de ces caractéristiques"
				vehicleId={vehicleId as string}
				onSubmitCallback={() => {
					router.replace({
						pathname: "/create-vehicle/[vehicleId]/vehicle-details",
						params: { vehicleId: vehicleId as string },
					});
				}}
			/>
		</View>
	);
}
