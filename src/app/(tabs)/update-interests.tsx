import { UpdateInterests } from "@/components/user-details/update-interests";
import { router } from "expo-router";
import { View } from "react-native";

export default function UpdateInterestsScreen() {
	return (
		<View className="flex-1 bg-black pt-4">
			<UpdateInterests
				onSubmitCallback={() => {
					router.push({
						pathname: "/(tabs)/profile",
						params: { initialTab: 1 },
					});
				}}
			/>
		</View>
	);
}
