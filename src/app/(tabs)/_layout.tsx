import { AddIcon } from "@/components/vectors/add-icon";
import { DirectMessageIcon } from "@/components/vectors/direct-message-icon";
import { IconCalendar } from "@/components/vectors/icon-calendar";
import { IconHome } from "@/components/vectors/icon-home";
import { NotificationIcon } from "@/components/vectors/notification-icon";
import { OptionsIcon } from "@/components/vectors/options-icon";
import { SearchIcon } from "@/components/vectors/search";
import { checkIfProfileComplete } from "@/lib/helpers/check-if-profile-complete";
import { formatPicturesUri } from "@/lib/helpers/format-pictures-uri";
import {
	handleNotificationReceived,
	handleNotificationResponse,
} from "@/lib/notifications";
import { useHasUnreadMessages } from "@/network/chat";
import { useHasUnreadNotifications } from "@/network/notifications";
import { useGetSession } from "@/network/session";
import { useFetchUserProfile } from "@/network/user-profile";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { Link, Tabs, router } from "expo-router";
import { useEffect } from "react";

import { Image, Pressable, Text, View } from "react-native";

// At the top of your file, add this debug function
const debugLog = (message: string, data?: any) => {
	const log = data ? `${message}: ${JSON.stringify(data, null, 2)}` : message;
	console.log(log);
	// Force log to show even in production
	if (__DEV__) {
		console.warn(log);
	}
};

export default function TabLayout() {
	const { data: hasUnreadMessages } = useHasUnreadMessages();
	const { data: profile, isLoading: loadingProfile } = useFetchUserProfile();

	const { data: session } = useGetSession();
	const { data: hasUnreadNotifications } = useHasUnreadNotifications(
		session?.user.id as string,
	);

	useEffect(() => {
		debugLog("=== NOTIFICATION SETUP START ===");
		debugLog("Session state:", { hasUser: !!session?.user });

		if (session?.user) {
			const setupNotifications = async () => {
				try {
					debugLog("Checking notification permissions");
					const { status: existingStatus } =
						await Notifications.getPermissionsAsync();
					debugLog("Current permission status:", existingStatus);

					let finalStatus = existingStatus;

					if (existingStatus !== "granted") {
						debugLog("Requesting permissions");
						const { status } = await Notifications.requestPermissionsAsync();
						finalStatus = status;
						debugLog("New permission status:", status);
					}

					if (finalStatus !== "granted") {
						debugLog("Permission denied");
						return;
					}

					// Test if we can get the token
					try {
						debugLog("Getting Expo push token");
						const tokenData = await Notifications.getExpoPushTokenAsync({
							projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
						});
						debugLog("Successfully got push token:", tokenData);
					} catch (tokenError) {
						debugLog("Error getting push token:", tokenError);
					}

					// Set up listeners
					debugLog("Setting up notification listeners");
					const notificationListener =
						Notifications.addNotificationReceivedListener((notification) => {
							debugLog("🔔 Notification received in foreground:", notification);
							handleNotificationReceived(notification);
						});

					const responseListener =
						Notifications.addNotificationResponseReceivedListener(
							(response) => {
								debugLog("🔔 Notification response received:", response);
								handleNotificationResponse(response);
							},
						);

					return () => {
						debugLog("Cleaning up notification listeners");
						Notifications.removeNotificationSubscription(notificationListener);
						Notifications.removeNotificationSubscription(responseListener);
					};
				} catch (error) {
					debugLog("Error in notification setup:", error);
				}
			};

			setupNotifications();
		}

		debugLog("=== NOTIFICATION SETUP END ===");
	}, [session?.user]);

	if (loadingProfile) {
		return <Text>Loading...</Text>;
	}

	if (!profile) {
		return <Text>No profile found</Text>;
	}

	return (
		<View className="flex-1 w-full">
			<Tabs
				screenOptions={{
					headerShown: false,
					headerStyle: {
						backgroundColor: "#000",
					},
					headerTitleContainerStyle: {
						height: "auto",
					},
					tabBarActiveTintColor: "#fff",
					tabBarInactiveTintColor: "#757575",
					tabBarStyle: {
						backgroundColor: "#1F1F1F",
						borderTopWidth: 1,
						borderTopColor: "#2F2F2F",
						height: 80,
						paddingTop: 10,
					},
					tabBarItemStyle: {
						width: "20%",
						height: 80,
						padding: 0,
						margin: 0,
					},
					gestureEnabled: false,
				}}
			>
				<Tabs.Screen
					name="index"
					options={{
						headerShown: true,
						title: "Feed",
						sceneStyle: {
							backgroundColor: "#000",
						},
						headerTitleAlign: "left",
						headerTitleStyle: {
							color: "#fff",
							textAlign: "left",
							fontSize: 18,
							fontWeight: "800",
						},
						tabBarShowLabel: false,
						tabBarIcon: ({ color }) => (
							<View className="flex-1 items-center justify-center">
								<IconHome color={color} fill={color} />
							</View>
						),
						headerRight: () => (
							<View className="flex-row items-center gap-2">
								<Link href="/(onboarding)" asChild>
									<Pressable>
										{({ pressed }) => (
											<OptionsIcon
												fill="#fff"
												style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
											/>
										)}
									</Pressable>
								</Link>

								<Link href="/(tabs)/notifications" asChild>
									<Pressable>
										{({ pressed }) => (
											<View className="relative">
												<NotificationIcon
													fill="#fff"
													style={{
														marginRight: 15,
														opacity: pressed ? 0.5 : 1,
													}}
												/>
												{hasUnreadNotifications && (
													<View className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full" />
												)}
											</View>
										)}
									</Pressable>
								</Link>

								<Link href="/(chats)" asChild>
									<Pressable>
										{({ pressed }) => (
											<View className="relative">
												<DirectMessageIcon
													fill="#fff"
													style={{
														marginRight: 15,
														opacity: pressed ? 0.5 : 1,
													}}
												/>
												{hasUnreadMessages && (
													<View className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full" />
												)}
											</View>
										)}
									</Pressable>
								</Link>
							</View>
						),
					}}
					initialParams={{
						isProfileComplete: checkIfProfileComplete(profile),
					}}
				/>
				<Tabs.Screen
					name="discover"
					options={{
						headerShown: false,
						headerStyle: { backgroundColor: "#000" },
						headerTitle: "",
						sceneStyle: {
							paddingHorizontal: 12,
							backgroundColor: "#000",
						},
						tabBarIcon: ({ color }) => (
							<View className="w-full">
								<Pressable
									onPress={() => router.replace("/discover")}
									className="flex-1 items-center justify-center h-[80px] bg-red-500"
								>
									<SearchIcon color={color} fill={color} />
								</Pressable>
							</View>
						),
						tabBarShowLabel: false,
					}}
				/>
				<Tabs.Screen
					name="add"
					options={{
						tabBarShowLabel: false,
						tabBarIcon: (props) => (
							<Pressable
								onPress={() => router.replace("/(create-vehicle)")}
								className="flex-1 items-center justify-center h-full relative"
							>
								<View className="absolute bottom-1 p-4 mx-auto bg-[#4AA8BA] rounded-full flex items-center justify-center">
									<AddIcon />
								</View>
							</Pressable>
						),
					}}
				/>
				<Tabs.Screen
					name="calendar"
					options={{
						tabBarIcon: ({ color }) => (
							<Pressable
								onPress={() => router.replace("/calendar")}
								className="flex-1 items-center justify-center"
							>
								<IconCalendar color={color} fill={color} />
							</Pressable>
						),
						tabBarShowLabel: false,
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						headerShown: true,
						title: "Mon profil",
						sceneStyle: {
							paddingHorizontal: 12,
							backgroundColor: "#000",
						},
						headerTitleAlign: "center",
						headerTitleStyle: {
							color: "#fff",
							textAlign: "auto",
							fontSize: 18,
							fontWeight: "800",
						},
						tabBarShowLabel: false,
						headerRight: () => (
							<View className="flex-row items-center gap-2 rotate-90">
								<Pressable
									onPress={() => {
										router.replace({
											pathname: "/(tabs)/settings",
											params: {
												userId: profile?.user_id,
												previousScreen: "/(tabs)/profile",
											},
										});
									}}
								>
									<Ionicons name="settings-outline" size={24} color="#fff" />
								</Pressable>
							</View>
						),
						href: {
							pathname: "/(tabs)/profile",
						},
						tabBarIcon: ({ color, focused }) => (
							<Pressable
								onPress={() =>
									router.push({
										pathname: "/(tabs)/profile",
									})
								}
								className="flex-1 items-center justify-center"
							>
								{profile?.profile_picture_url ? (
									<Image
										source={{
											uri: formatPicturesUri(
												"profile_pictures",
												profile?.profile_picture_url as string,
											),
										}}
										className={`w-6 h-6 rounded-full bg-slate-500 bg-cover ${
											focused ? "border-2 border-white" : ""
										}`}
									/>
								) : (
									<View className="w-6 h-6 flex items-center justify-center">
										<Text className="text-white text-sm font-semibold">
											<Ionicons name="person" size={20} color={color} />
										</Text>
									</View>
								)}
							</Pressable>
						),
					}}
				/>

				<Tabs.Screen
					name="user"
					options={{
						headerShown: true,
						tabBarShowLabel: false,
						href: null,
						title: "Utilisateur",
						sceneStyle: {
							paddingHorizontal: 12,
							backgroundColor: "#000",
						},
						headerTitleAlign: "left",
						headerTitleStyle: {
							color: "#fff",
							textAlign: "auto",
							fontSize: 18,
							fontWeight: "800",
						},
					}}
				/>
				<Tabs.Screen
					name="settings"
					options={{
						tabBarShowLabel: false,
						href: null,
						title: "Paramètres",
						headerShown: true,
						headerTintColor: "white",
						headerStyle: { backgroundColor: "#000" },
					}}
				/>
				<Tabs.Screen
					name="notification-preferences"
					options={{
						tabBarShowLabel: false,
						href: null,
						title: "Notifications",
						headerShown: true,
						headerTintColor: "white",
						headerStyle: { backgroundColor: "#000" },
					}}
				/>
				<Tabs.Screen
					name="notifications"
					options={{
						headerShown: true,
						href: null,
						title: "Notifications",
						sceneStyle: {
							paddingHorizontal: 12,
							backgroundColor: "#000",
						},
						tabBarShowLabel: false,
						headerTitleAlign: "center",
						headerTitleStyle: {
							color: "#fff",
							textAlign: "auto",
							fontSize: 18,
							fontWeight: "800",
						},
						headerLeft: () => (
							<View className="flex-row items-center gap-2">
								<Pressable
									onPress={() => {
										router.replace({
											pathname: "/(tabs)",
											params: {
												previousScreen: "/(tabs)/notifications",
											},
										});
									}}
								>
									<Ionicons name="chevron-back" size={24} color="#fff" />
								</Pressable>
							</View>
						),
					}}
				/>
			</Tabs>
		</View>
	);
}
