import { useFetchUserProfile } from "@/network/user-profile";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { Text, View } from "react-native";

export default function TabLayout() {
	const { data: profile, isLoading: loadingProfile } = useFetchUserProfile();

	if (loadingProfile) {
		return <Text>Loading...</Text>;
	}

	if (!profile) {
		return <Text>No profile found</Text>;
	}

	return (
		<View className="flex-1 w-full">
			<Stack
				screenOptions={{
					headerShown: false,
					headerStyle: {
						backgroundColor: "#000",
					},
					gestureEnabled: false,
				}}
			>
				<Stack.Screen
					name="update-services"
					options={{
						headerShown: true,
						headerTintColor: "white",
						headerTitle: "Modifier mes services",
						headerStyle: { backgroundColor: "#000" },
						headerLeft: () => (
							<Ionicons
								name="chevron-back"
								size={24}
								color="white"
								onPress={() =>
									router.push({
										pathname: "/(tabs)/profile",
										params: { initialTab: 1 },
									})
								}
							/>
						),
					}}
				/>
				<Stack.Screen
					name="update-interests"
					options={{
						headerShown: true,
						headerTintColor: "white",
						headerTitle: "Modifier mes centres d'intérêts",
						headerStyle: { backgroundColor: "#000" },
						headerLeft: () => (
							<Ionicons
								name="chevron-back"
								size={24}
								color="white"
								onPress={() =>
									router.push({
										pathname: "/(tabs)/profile",
										params: { initialTab: 1 },
									})
								}
							/>
						),
					}}
				/>

				<Stack.Screen
					name="update-departments"
					options={{
						headerShown: true,
						headerTintColor: "white",
						headerTitle: "Modifier mes départements",
						headerStyle: { backgroundColor: "#000" },
						headerLeft: () => (
							<Ionicons
								name="chevron-back"
								size={24}
								color="white"
								onPress={() =>
									router.push({
										pathname: "/(tabs)/profile",
										params: { initialTab: 1 },
									})
								}
							/>
						),
					}}
				/>

				<Stack.Screen
					name="update-profile"
					options={{
						headerShown: true,
						headerTintColor: "white",
						headerTitle: "Modifier mes informations",
						headerStyle: { backgroundColor: "#000" },
						headerLeft: () => (
							<Ionicons
								name="chevron-back"
								size={24}
								color="white"
								onPress={() =>
									router.push({
										pathname: "/(profile)/update-pseudo",
										params: { userId: profile?.user_id },
									})
								}
							/>
						),
					}}
				/>

				<Stack.Screen
					name="update-pseudo"
					options={{
						headerShown: true,
						headerTintColor: "white",
						headerTitle: "Modifier mon pseudo",
						headerStyle: { backgroundColor: "#000" },
						headerLeft: () => (
							<Ionicons
								name="chevron-back"
								size={24}
								color="white"
								onPress={() =>
									router.push({
										pathname: "/(tabs)/profile",
										params: { initialTab: 1 },
									})
								}
							/>
						),
					}}
				/>

				<Stack.Screen
					name="update-avatar"
					options={{
						headerShown: true,
						headerTintColor: "white",
						headerTitle: "Modifier mon avatar",
						headerStyle: { backgroundColor: "#000" },
						headerLeft: () => (
							<Ionicons
								name="chevron-back"
								size={24}
								color="white"
								onPress={() =>
									router.push({
										pathname: "/(tabs)/profile",
										params: { initialTab: 1 },
									})
								}
							/>
						),
					}}
				/>

				<Stack.Screen
					name="followers"
					options={{
						headerShown: true,
						headerTintColor: "white",
						headerTitle: "Suivi",
						headerStyle: { backgroundColor: "#000" },
					}}
				/>

				<Stack.Screen
					name="following"
					options={{
						headerShown: true,
						headerTintColor: "white",
						headerTitle: "Suivi",
						headerStyle: { backgroundColor: "#000" },
					}}
				/>
			</Stack>
		</View>
	);
}
