import "@/global.css";
import "react-native-reanimated";
import { ProgressBar } from "@/components/ui/progress-bar";
import { BottomSheetProvider } from "@/context/BottomSheetContext";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import type React from "react";
import { AppState, LogBox, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export { ErrorBoundary } from "expo-router";

import { supabase } from "@/lib/supabase";

LogBox.ignoreLogs(["new NativeEventEmitter"]);

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