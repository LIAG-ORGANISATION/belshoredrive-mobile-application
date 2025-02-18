import { UpdatePseudo } from "@/components/user-details/update-pseudo";
import { router } from "expo-router";

export default function Username() {
  return (
    <UpdatePseudo title="Choisissez un pseudonyme" onSuccess={() => router.push("/complete-profile/pick-avatar")} />
  );
}
