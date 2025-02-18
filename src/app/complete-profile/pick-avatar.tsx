import { router } from "expo-router";

import { PickAvatar } from "@/components/user-details/update-avatar";

export default function PickAvatarScreen() {
	return (
		<PickAvatar
			title="Choisissez un avatar"
			onSuccess={() => router.push("/complete-profile/profile-details")}
		/>
	);
}
