import { ProfileComponent } from "@/components/user-details/profile";
import { useLocalSearchParams } from "expo-router";

export default function ProfileScreen() {
	const { userId } = useLocalSearchParams();

	return <ProfileComponent userId={userId as string} isCurrentUser={true} />;
}
