import { ProfileComponent } from "@/components/user-details/profile";
import { Ionicons } from "@expo/vector-icons";
import {
	type RelativePathString,
	router,
	useLocalSearchParams,
	useNavigation,
} from "expo-router";
import { useEffect } from "react";
import { Pressable } from "react-native";

export default function UserScreen() {
	const navigation = useNavigation();
	const { userId, previousScreen } = useLocalSearchParams();

	useEffect(() => {
		if (previousScreen) {
			navigation.setOptions({
				headerLeft: () => {
					return (
						<Pressable
							onPress={() =>
								router.replace({
									pathname: previousScreen as RelativePathString,
									params: { userId },
								})
							}
						>
							<Ionicons name="chevron-back" size={24} color="white" />
						</Pressable>
					);
				},
			});
		} else {
			navigation.setOptions({
				headerLeft: () => {
					return (
						<Pressable onPress={() => router.back()}>
							<Ionicons name="chevron-back" size={24} color="white" />
						</Pressable>
					);
				},
			});
		}
	}, [previousScreen]);

	return (
		<ProfileComponent
			userId={userId as string}
			isCurrentUser={false}
			showDraftVehicles={false}
		/>
	);
}
