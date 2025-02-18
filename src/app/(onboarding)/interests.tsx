import { router } from "expo-router";
import { View } from "react-native";

import { UpdateInterests } from "@/components/user-details/update-interests";

export default function OnboardingInterests() {
	return (
		<View className="flex-1 bg-black relative px-2">
			<UpdateInterests
				title="Quel(s) intérêt(s) partagez-vous ?"
				onSubmitCallback={() => router.push("/(onboarding)/contacts")}
			/>
		</View>
	);
}
