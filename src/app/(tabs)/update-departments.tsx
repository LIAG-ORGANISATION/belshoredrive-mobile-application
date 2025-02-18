import { UpdateDepartments } from "@/components/user-details/update-departments";
import { useFetchUserProfile } from "@/network/user-profile";
import { router } from "expo-router";
import { View } from "react-native";

export default function UpdateDepartmentsScreen() {
	const { data: profile } = useFetchUserProfile();
	return (
		<View className="flex-1 bg-black pt-4">
			<UpdateDepartments
				onSubmitCallback={() => {
					router.push({
						pathname: "/(tabs)/profile",
						params: { initialTab: 1, userId: profile?.user_id },
					});
				}}
			/>
		</View>
	);
}
