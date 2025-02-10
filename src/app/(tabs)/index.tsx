import { CompleteProfileCta } from "@/components/ui/complete-profile-cta";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function TabOneScreen() {
  const { isProfileComplete } = useLocalSearchParams();
  console.log(isProfileComplete);
  return (
    <View className="flex-1 items-center justify-start bg-black text-white mt-5">
      {isProfileComplete === "false" && <CompleteProfileCta />}
    </View>
  );
}
