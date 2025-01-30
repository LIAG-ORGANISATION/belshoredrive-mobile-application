import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Stack.Screen options={{ title: "Oops!" }} />
      <Text className="text-2xl font-bold">This screen doesn't exist.</Text>

      <Link href="/" className="mt-15">
        <Text className="text-lg text-blue-500">Go to home screen!</Text>
      </Link>
    </View>
  );
}
