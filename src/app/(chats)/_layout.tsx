import { useFetchUserProfile } from "@/network/user-profile";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ChatsLayout() {
	const { data: profile, isLoading: loadingProfile } = useFetchUserProfile();
	const params = useLocalSearchParams();

	if (loadingProfile) {
		return <Text>Loading...</Text>;
	}

	if (!profile) {
		return <Text>No profile found</Text>;
	}

	return (
		<View className="flex-1 bg-black">
			<View className="flex-1 py-safe-offset-2">
				<Stack
					screenOptions={{
						headerShown: false,
						headerTintColor: "white",
						headerTitle: "Conversations",
						headerStyle: { backgroundColor: "#000" },
					}}
				>
					<Stack.Screen
						name="index"
						options={{
							headerShown: true,
							headerTitle: "Messages",
							headerStyle: { backgroundColor: "#000" },
							headerLeft: () => (
								<Ionicons
									name="chevron-back"
									size={24}
									color="white"
									onPress={() => router.back()}
								/>
							),
						}}
					/>

					<Stack.Screen
						name="details/[chatId]"
						options={{
							headerShown: true,
							headerStyle: { backgroundColor: "#000" },
							headerTintColor: "white",
							headerTitle: ({ children }) => (
								<Text className="text-white text-lg font-bold">
									{params.title || children}
								</Text>
							),
							headerLeft: () => (
								<Ionicons
									name="chevron-back"
									size={24}
									color="white"
									onPress={() => router.back()}
								/>
							),
						}}
					/>
				</Stack>
			</View>
		</View>
	);
}
