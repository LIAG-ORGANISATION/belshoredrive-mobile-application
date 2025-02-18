import { UpdateProfile } from "@/components/user-details/update-profile";
import { useFetchUserProfile } from "@/network/user-profile";
import { router } from "expo-router";

export default function UpdateProfileScreen() {
  const { data: profile } = useFetchUserProfile();

  return (
    <UpdateProfile
      onSuccess={() => router.push({
        pathname: "/(tabs)/profile",
        params: {
          initialTab: 1,
          userId: profile?.user_id,
        },
      })}
    />
  );
}
