import { UpdatePseudo } from "@/components/user-details/update-pseudo";
import { router } from "expo-router";

export default function UpdatePseudoScreen() {
	return (
		<UpdatePseudo onSuccess={() => router.push("/(profile)/update-profile")} />
	);
}
