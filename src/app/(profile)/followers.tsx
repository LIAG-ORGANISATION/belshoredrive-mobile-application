import { FollowList } from "@/components/user-details/follow-list";
import { useFetchUserProfile } from "@/network/user-profile";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function FollowersScreen() {
	const { userId } = useLocalSearchParams();
	const { data: profile } = useFetchUserProfile();

	if (!profile) {
		return (
			<View>
				<Text>No profile found</Text>
			</View>
		);
	}

	return <FollowList userId={userId as string} type="followers" />;
}
