import { router } from "expo-router";
import { View } from "react-native";

import { UpdateDepartments } from "@/components/user-details/update-departments";

export default function OnboardingDepartments() {
  return (
    <View className="flex-1 bg-black relative px-2">
      <UpdateDepartments
        title="Dans quelle(s) région(s) peut-on vous croiser ?"
        onSubmitCallback={() => router.push("/(onboarding)/brands")}
      />
    </View>
  );
}