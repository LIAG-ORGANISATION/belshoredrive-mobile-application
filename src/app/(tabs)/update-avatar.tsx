import { PickAvatar } from "@/components/user-details/update-avatar";
import { router } from "expo-router";

export default function UpdateAvatarScreen() {
  return (
    <PickAvatar
      onSuccess={() => router.push({
        pathname: "/(tabs)/profile",
        params: {
          initialTab: 1,
        },
      })}
    />
  );
}
