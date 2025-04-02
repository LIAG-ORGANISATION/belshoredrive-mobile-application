import { VehicleProfile } from "@/components/vehicle-details";
import { router, useLocalSearchParams } from "expo-router";

export default function CreateVehicleDetails() {
	const { vehicleId } = useLocalSearchParams();
	return (
		<VehicleProfile
			onSuccess={() => {
				router.push({
					pathname: "/(create-vehicle)/[vehicleId]/tags",
					params: { vehicleId: vehicleId as string },
				});
			}}
			vehicleId={vehicleId as string}
		/>
	);
}
