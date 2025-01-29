import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function TabOneScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Link replace href="/onboarding">
        <Text className="text-2xl font-bold"> Go to Onboarding</Text>
      </Link>
      <View className="h-1 w-full bg-gray-200" />
    </View>
  );
}
