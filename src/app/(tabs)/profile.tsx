import { ProfileComponent } from "@/components/user-details/profile";
import { useFetchUserProfile } from "@/network/user-profile";

export default function ProfileScreen() {
	const { data: profile, isLoading: loadingProfile } = useFetchUserProfile();

	return (
		<ProfileComponent
			userId={profile?.user_id as string}
			isCurrentUser={true}
			showDraftVehicles={true}
		/>
	);
}
