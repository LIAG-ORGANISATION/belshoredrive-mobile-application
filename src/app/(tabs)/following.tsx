import { FollowList } from "@/components/user-details/follow-list";
import { useFetchUserProfile } from "@/network/user-profile";
import { ScrollView, Text, View } from "react-native";

export default function FollowingScreen() {
	const { data: profile } = useFetchUserProfile();

	if (!profile) {
		return (
			<View>
				<Text>No profile found</Text>
			</View>
		);
	}

	return (
		<ScrollView className="w-full flex-1 bg-black text-white">
			<FollowList userId={profile?.user_id} type="following" />
		</ScrollView>
	);
}
