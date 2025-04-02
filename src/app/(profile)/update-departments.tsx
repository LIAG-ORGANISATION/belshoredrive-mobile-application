import { UpdateDepartments } from "@/components/user-details/update-departments";
import { router } from "expo-router";
import { View } from "react-native";

export default function UpdateDepartmentsScreen() {
	return (
		<View className="flex-1 bg-black pt-4">
			<UpdateDepartments
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
