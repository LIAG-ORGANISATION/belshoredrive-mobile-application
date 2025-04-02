import { UpdateServices } from "@/components/user-details/update-services";
import { router } from "expo-router";
import { View } from "react-native";

export default function UpdateServicesScreen() {
	return (
		<View className="flex-1 bg-black pt-4">
			<UpdateServices
				onSubmitCallback={() => {
					router.replace({
						pathname: "/(tabs)/profile",
						params: { initialTab: 1 },
					});
				}}
			/>
		</View>
	);
}
