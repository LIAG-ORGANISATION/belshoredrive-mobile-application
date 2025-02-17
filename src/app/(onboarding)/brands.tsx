import React from "react";
import { View } from "react-native";

import { router } from "expo-router";

import { UpdateBrands } from "@/components/user-details/update-brands";

export default function OnboardingBrands() {
  return (
    <View className="flex-1 bg-black relative px-2">
      <UpdateBrands title="Quelles sont tes marques préférées ?" onSubmitCallback={() => router.push("/(onboarding)/interests")} />
    </View>
  );
}
