import { FollowList } from "@/components/user-details/follow-list";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

export default function FollowingScreen() {
	const { userId } = useLocalSearchParams();

	return (
		<ScrollView className="w-full flex-1 bg-black text-white">
			<FollowList userId={userId as string} type="following" />
		</ScrollView>
	);
}
