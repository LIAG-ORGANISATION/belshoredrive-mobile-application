import { UpdateProfile } from "@/components/user-details/update-profile";
import { router } from "expo-router";

export default function UpdateProfileScreen() {
  return (
    <UpdateProfile
      onSuccess={() => router.push({
        pathname: "/(tabs)/profile",
        params: {
          initialTab: 1,
        },
      })}
    />
  );
}
