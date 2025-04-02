import { NotificationPreferencesComponent } from "@/components/user-details/notification-preferences";
import { Ionicons } from "@expo/vector-icons";
import {
	type RelativePathString,
	router,
	useLocalSearchParams,
	useNavigation,
} from "expo-router";
import { useEffect } from "react";
import { Pressable } from "react-native";

export default function NotificationPreferencesScreen() {
	const navigation = useNavigation();
	const { userId, previousScreen } = useLocalSearchParams();

	useEffect(() => {
		if (previousScreen) {
			navigation.setOptions({
				headerLeft: () => {
					return (
						<Pressable
							onPress={() =>
								router.push({
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
		}
	}, [previousScreen]);

	return <NotificationPreferencesComponent />;
}
