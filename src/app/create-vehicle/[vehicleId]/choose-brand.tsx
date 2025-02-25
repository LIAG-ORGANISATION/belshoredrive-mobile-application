import { ChooseBrand } from "@/components/vehicle-details/choose-brand";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { View } from "react-native";

export default function ChooseBrandScreen() {
	const { vehicleId } = useLocalSearchParams();
	return (
		<View className="flex-1 bg-black relative px-2">
			<ChooseBrand
				title="Choisissez une marque"
				subtitle="Les tags permettent aux passionnés de trouver votre véhicule plus facilement en fonction de ces caractéristiques"
				vehicleId={vehicleId as string}
				onSubmitCallback={() => {
					router.back();
				}}
			/>
		</View>
	);
}
