import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { supabase } from "./supabase";

// Configure how notifications should be handled when app is in foreground
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

// Register for push notifications
export async function registerForPushNotificationsAsync() {
	let token: string | undefined;

	if (!Device.isDevice) {
		// alert("Must use physical device for Push Notifications");
		// return;
	}

	// Check if we already have permission
	const { status: existingStatus } = await Notifications.getPermissionsAsync();

	let finalStatus = existingStatus;

	// If we don't have permission, ask for it
	if (existingStatus !== "granted") {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}

	// If we still don't have permission, return
	if (finalStatus !== "granted") {
		// alert("Failed to get push token for push notification!");
		return;
	}

	try {
		// Get the token
		token = (
			await Notifications.getExpoPushTokenAsync({
				projectId: process.env.EXPO_PUBLIC_PROJECT_ID, // Make sure this is set in your env
			})
		).data;

		// Store the token in Supabase
		const { error } = await supabase
			.from("user_profiles")
			.update({ expo_push_token: token })
			.eq("user_id", (await supabase.auth.getUser()).data.user?.id);

		if (error) {
			console.error("Error saving push token:", error);
		}

		// Android-specific notification channel
		if (Platform.OS === "android") {
			await Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#FF231F7C",
			});
		}

		return token;
	} catch (error) {
		console.error("Error getting push token:", error);
	}
}

// Handle notification opened app from background state
export function handleNotificationResponse(
	response: Notifications.NotificationResponse,
) {
	const data = response.notification.request.content.data;

	// Handle different notification types
	switch (data.type) {
		case "new_comment":
			// Navigate to vehicle details
			break;
		case "new_follower":
			// Navigate to profile
			break;
		case "new_message":
			// Navigate to chat
			break;
		case "new_vehicle":
			// Navigate to vehicle details
			break;
		case "new_rating":
			// Navigate to vehicle details
			break;
	}
}

// Handle notification received while app is in foreground
export function handleNotificationReceived(
	notification: Notifications.Notification,
) {
	const data = notification.request.content.data;
	console.log("Notification received in foreground:", data);
}
