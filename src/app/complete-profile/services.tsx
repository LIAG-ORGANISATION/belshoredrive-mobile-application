import { router } from "expo-router";
import { View } from "react-native";

import { UpdateServices } from "@/components/user-details/update-services";

export default function Services() {
  return (
    <View className="flex-1 bg-black">
      <UpdateServices
        title="Quel(s) service(s) offrez-vous ?"
        onSubmitCallback={() => {
          // Navigate to profile tab and set initial tab index
          router.push({
            pathname: "/(tabs)/profile",
            params: { initialTab: 1 }
          });
        }}
      />
    </View>
  );
}