import { Text, View } from "react-native";

export default function TabOneScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">Tab One</Text>
      <View className="h-1 w-full bg-gray-200" />
    </View>
  );
}