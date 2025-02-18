import { FollowList } from "@/components/user-details/follow-list";
import { useFetchUserProfile } from "@/network/user-profile";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function FollowersScreen() {
	const { userId } = useLocalSearchParams();
	const { data: profile } = useFetchUserProfile();
	const navigation = useNavigation();

	if (!profile) {
		return (
			<View>
				<Text>No profile found</Text>
			</View>
		);
	}

	useEffect(() => {
		console.log("userId", userId);

		navigation.setOptions({
			headerLeft: () => (
				<Ionicons
					name="chevron-back"
					size={24}
					color="white"
					onPress={() => {
						router.push({
							pathname: "/(tabs)/profile",
							params: { userId },
						});
					}}
				/>
			),
		})
	}, []);

	return (
		<FollowList
			userId={profile?.user_id}
			type="followers"
		/>
	);
}
