import "@/global.css";
import "react-native-reanimated";
import { ProgressBar } from "@/components/ui/progress-bar";
import { BottomSheetProvider } from "@/context/BottomSheetContext";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import type React from "react";
import { AppState, LogBox, View } from "react-native";
export { ErrorBoundary } from "expo-router";

import { supabase } from "@/lib/supabase";
import { GestureHandlerRootView } from "react-native-gesture-handler";

LogBox.ignoreLogs(["new NativeEventEmitter"]);

// Configure notification behavior
Notifications.setNotificationHandler({
	handleNotification: async (notification) => {
		console.log("🎯 Handling notification:", {
			date: new Date().toISOString(),
			notification: JSON.stringify(notification, null, 2)
		});

		return {
			shouldShowAlert: true,
			shouldPlaySound: true,
			shouldSetBadge: true,
			priority: Notifications.AndroidNotificationPriority.MAX,
			ios: {
				sound: true,
				priority: 1,
				foregroundPresentationOptions: {
					alert: true,
					badge: true,
					sound: true,
				},
			},
		};
	},
});

export const unstable_settings = {
	initialRouteName: "/index",
};

const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout({
	children,
}: { children: React.ReactNode }) {
	const [loaded, error] = useFonts({
		...FontAwesome.font,
		SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
		Poppins: require("../../assets/fonts/Poppins-Regular.ttf"),
		PoppinsBold: require("../../assets/fonts/Poppins-Bold.ttf"),
		PoppinsSemiBold: require("../../assets/fonts/Poppins-SemiBold.ttf"),
		PoppinsMedium: require("../../assets/fonts/Poppins-Medium.ttf"),
	});

	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	useEffect(() => {
		const subscription = AppState.addEventListener("change", (state) => {
			if (state === "active") {
				supabase.auth.startAutoRefresh();
			} else {
				supabase.auth.stopAutoRefresh();
			}
		});

		return () => {
			subscription.remove();
		};
	}, []);

	useEffect(() => {
		const checkSession = async () => {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();
			if (session) {
				// User is signed in, redirect to main app
				router.replace("/(tabs)");
			} else {
				// No session, stay on auth flow
				router.push("/auth");
			}
		};

		checkSession();
	}, []);

	useEffect(() => {
		// Set up notification handlers
		const setupNotifications = async () => {
			// Request permissions
			const { status: existingStatus } = await Notifications.getPermissionsAsync();
			console.log("Current permission status:", existingStatus);

			let finalStatus = existingStatus;
			if (existingStatus !== 'granted') {
				const { status } = await Notifications.requestPermissionsAsync({
					ios: {
						allowAlert: true,
						allowBadge: true,
						allowSound: true,
					},
				});
				finalStatus = status;
			}
			console.log("Final permission status:", finalStatus);

			// Set up foreground handler
			const foregroundSubscription = Notifications.addNotificationReceivedListener(
				notification => {
					console.log("🔔 Foreground notification received:", notification);
				}
			);

			// Set up background handler
			const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(
				response => {
					console.log("📱 Background notification response:", response);
				}
			);

			return () => {
				foregroundSubscription.remove();
				backgroundSubscription.remove();
			};
		};

		setupNotifications();
	}, []);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<BottomSheetProvider>
				<QueryClientProvider client={queryClient}>
					<ThemeProvider value={DefaultTheme}>
						<View className="flex-1 bg-black font-sans">
							<Stack
								screenOptions={{
									headerShown: false,
									headerTintColor: "white",
									headerStyle: { backgroundColor: "#000" },
									gestureEnabled: false,
								}}
							>
								<Stack.Screen
									name="index"
									options={{ headerShown: false, headerTitle: "" }}
								/>
								<Stack.Screen
									name="auth/index"
									options={{
										headerShown: true,
										headerStyle: { backgroundColor: "#000" },
										headerTitle: "",
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
									name="auth/login"
									options={{
										headerShown: true,
										headerStyle: { backgroundColor: "#000" },
										headerTitle: "",
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
									name="auth/phone"
									options={{
										headerShown: true,
										headerStyle: { backgroundColor: "#000" },
										headerTitle: () => (
											<ProgressBar currentStep={0} totalSteps={4} />
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
								<Stack.Screen
									name="auth/phone-verification"
									options={{
										headerShown: true,
										headerStyle: { backgroundColor: "#000" },
										headerTitle: () => (
											<ProgressBar currentStep={2} totalSteps={4} />
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
								<Stack.Screen
									name="auth/email"
									options={{
										headerShown: true,
										headerStyle: { backgroundColor: "#000" },
										headerTitle: () => (
											<ProgressBar currentStep={0} totalSteps={4} />
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
								<Stack.Screen
									name="auth/verification"
									options={{
										headerShown: true,
										headerStyle: { backgroundColor: "#000" },
										headerTitle: () => (
											<ProgressBar currentStep={1} totalSteps={4} />
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

								<Stack.Screen
									name="(onboarding)"
									options={{
										headerShown: false,
									}}
								/>

								<Stack.Screen
									name="(vehicle)"
									options={{
										headerShown: false,
									}}
								/>

								<Stack.Screen
									name="complete-profile/index"
									options={{
										headerShown: true,
										headerStyle: { backgroundColor: "#000" },
										headerTitle: () => (
											<ProgressBar currentStep={0} totalSteps={5} />
										),
										headerLeft: () => (
											<Ionicons
												name="chevron-back"
												size={24}
												color="white"
												onPress={() => {
													if (router.canGoBack()) {
														router.back();
													} else {
														router.replace("/(tabs)");
													}
												}}
											/>
										),
									}}
								/>
								<Stack.Screen
									name="complete-profile/pick-avatar"
									options={{
										headerShown: true,
										headerStyle: { backgroundColor: "#000" },
										headerTitle: () => (
											<ProgressBar currentStep={1} totalSteps={5} />
										),
										headerLeft: () => (
											<Ionicons
												name="chevron-back"
												size={24}
												color="white"
												onPress={() => {
													if (router.canGoBack()) {
														router.back();
													} else {
														router.replace("/(tabs)");
													}
												}}
											/>
										),
									}}
								/>

								<Stack.Screen
									name="complete-profile/profile-details"
									options={{
										headerShown: true,
										headerStyle: { backgroundColor: "#000" },
										headerTitle: () => (
											<ProgressBar currentStep={2} totalSteps={5} />
										),
										headerLeft: () => (
											<Ionicons
												name="chevron-back"
												size={24}
												color="white"
												onPress={() => {
													if (router.canGoBack()) {
														router.back();
													} else {
														router.replace("/(tabs)");
													}
												}}
											/>
										),
									}}
								/>
								<Stack.Screen
									name="complete-profile/services"
									options={{
										headerShown: true,
										headerStyle: { backgroundColor: "#000" },
										headerTitle: () => (
											<ProgressBar currentStep={3} totalSteps={5} />
										),
										headerLeft: () => (
											<Ionicons
												name="chevron-back"
												size={24}
												color="white"
												onPress={() => {
													if (router.canGoBack()) {
														router.back();
													} else {
														router.replace("/(tabs)");
													}
												}}
											/>
										),
									}}
								/>

								<Stack.Screen
									name="(chats)"
									options={{
										headerShown: false,
										headerTitle: "",
										headerStyle: { backgroundColor: "#000" },
									}}
								/>

								<Stack.Screen
									name="(create-vehicle)"
									options={{
										headerShown: false,
									}}
								/>

								<Stack.Screen
									name="(tabs)"
									options={{
										headerShown: false,
										headerStyle: { backgroundColor: "#000" },
									}}
								/>
							</Stack>
						</View>
					</ThemeProvider>
				</QueryClientProvider>
			</BottomSheetProvider>
		</GestureHandlerRootView>
	);
}