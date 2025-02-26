import { AddIcon } from "@/components/vectors/add-icon";
import { DirectMessageIcon } from "@/components/vectors/direct-message-icon";
import { IconCalendar } from "@/components/vectors/icon-calendar";
import { IconHome } from "@/components/vectors/icon-home";
import { NotificationIcon } from "@/components/vectors/notification-icon";
import { OptionsIcon } from "@/components/vectors/options-icon";
import { SearchIcon } from "@/components/vectors/search";
import { checkIfProfileComplete } from "@/lib/helpers/check-if-profile-complete";
import { formatPicturesUri } from "@/lib/helpers/format-pictures-uri";
import { supabase } from "@/lib/supabase";
import { useHasUnreadMessages } from "@/network/chat";
import { useFetchUserProfile } from "@/network/user-profile";
import { Ionicons } from "@expo/vector-icons";
import { Link, Tabs, router } from "expo-router";
import { useState } from "react";
import {
	Animated,
	Dimensions,
	Image,
	Pressable,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function TabLayout() {
	const { data: hasUnreadMessages } = useHasUnreadMessages();
	const { data: profile, isLoading: loadingProfile } = useFetchUserProfile();
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const slideAnim = useState(
		new Animated.Value(Dimensions.get("window").width),
	)[0];

	const toggleDrawer = () => {
		const toValue = isDrawerOpen ? Dimensions.get("window").width : 0;
		Animated.timing(slideAnim, {
			toValue,
			duration: 300,
			useNativeDriver: true,
		}).start();
		setIsDrawerOpen(!isDrawerOpen);
	};

	const handleLogout = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;

			// After successful logout, redirect to auth screen
			router.replace("/auth");
		} catch (error) {
			console.error("Error logging out:", error);
		}
	};

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

								<Link href="/(onboarding)" asChild>
									<Pressable>
										{({ pressed }) => (
											<NotificationIcon
												fill="#fff"
												style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
											/>
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
								onPress={() => router.replace("/create-vehicle")}
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
								<Pressable onPress={toggleDrawer}>
									<Ionicons name="settings-outline" size={24} color="#fff" />
								</Pressable>
							</View>
						),
						href: {
							pathname: "/(tabs)/profile",
							params: { userId: profile?.user_id },
						},
						tabBarIcon: ({ color, focused }) => (
							<Pressable
								onPress={() =>
									router.push({
										pathname: "/(tabs)/profile",
										params: { userId: profile?.user_id },
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
						href: null,
						title: "Utilisateur",
						headerShown: true,
						headerTintColor: "white",
						headerStyle: { backgroundColor: "#000" },
					}}
				/>

				<Tabs.Screen
					name="update-services"
					options={{
						href: null,
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
										params: { initialTab: 1, userId: profile.user_id },
									})
								}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="update-interests"
					options={{
						href: null,
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
										params: { initialTab: 1, userId: profile?.user_id },
									})
								}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="update-departments"
					options={{
						href: null,
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
										params: { initialTab: 1, userId: profile?.user_id },
									})
								}
							/>
						),
					}}
				/>

				<Tabs.Screen
					name="update-profile"
					options={{
						href: null,
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
										pathname: "/(tabs)/update-pseudo",
										params: { userId: profile?.user_id },
									})
								}
							/>
						),
					}}
				/>

				<Tabs.Screen
					name="update-pseudo"
					options={{
						href: null,
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
										params: { initialTab: 1, userId: profile?.user_id },
									})
								}
							/>
						),
					}}
				/>

				<Tabs.Screen
					name="update-avatar"
					options={{
						href: null,
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
										params: { initialTab: 1, userId: profile?.user_id },
									})
								}
							/>
						),
					}}
				/>

				<Tabs.Screen
					name="followers"
					options={{
						href: null,
						headerShown: true,
						headerTintColor: "white",
						headerTitle: "Suivi",
						headerStyle: { backgroundColor: "#000" },
					}}
				/>

				<Tabs.Screen
					name="following"
					options={{
						href: null,
						headerShown: true,
						headerTintColor: "white",
						headerTitle: "Suivi",
						headerStyle: { backgroundColor: "#000" },
					}}
				/>
			</Tabs>

			{/* Drawer Menu */}
			<Animated.View
				className="absolute top-0 right-0 h-full bg-[#1F1F1F] w-72 z-50"
				style={{
					transform: [{ translateX: slideAnim }],
					borderLeftWidth: 1,
					borderLeftColor: "#2F2F2F",
				}}
			>
				<View className="p-6">
					<Text className="text-white text-xl font-bold mb-6">Menu</Text>
					<Pressable
						className="py-3"
						onPress={() => {
							toggleDrawer();
						}}
					>
						<TouchableOpacity onPress={handleLogout}>
							<Text className="text-white text-lg">Déconnexion</Text>
						</TouchableOpacity>
					</Pressable>
				</View>
			</Animated.View>

			{/* Backdrop */}
			{isDrawerOpen && (
				<Pressable
					className="absolute top-0 left-0 right-0 bottom-0 bg-black/50"
					onPress={toggleDrawer}
				/>
			)}
		</View>
	);
}
