import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { supabase } from "./supabase";

const debugLog = (message: string, data?: any) => {
	const log = data ? `${message}: ${JSON.stringify(data, null, 2)}` : message;
	console.log(log);
	if (__DEV__) {
		console.warn(log);
	}
};

// Register for push notifications
export async function registerForPushNotificationsAsync() {
	try {
		debugLog("Starting push notification registration");

		if (!Device.isDevice) {
			debugLog("Not a physical device, skipping push registration");
			return;
		}

		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		debugLog("Current permission status:", existingStatus);

		let finalStatus = existingStatus;
		if (existingStatus !== "granted") {
			debugLog("Requesting push notification permissions");
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
			debugLog("New permission status:", status);
		}

		if (finalStatus !== "granted") {
			debugLog("Push notification permission denied");
			return;
		}

		debugLog("Getting push token");
		const token = await Notifications.getExpoPushTokenAsync({
			projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
		});
		debugLog("Push token received:", token);

		// Store token in Supabase
		const { data, error } = await supabase
			.from("user_profiles")
			.update({ expo_push_token: token.data })
			.eq("user_id", (await supabase.auth.getUser()).data.user?.id)
			.select();

		if (error) {
			debugLog("Error saving push token:", error);
		} else {
			debugLog("Push token saved successfully:", data);
		}

		// Set up Android channel
		if (Platform.OS === "android") {
			await Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#FF231F7C",
			});
		}

		return token.data;
	} catch (error) {
		debugLog("Error in registerForPushNotificationsAsync:", error);
		return undefined;
	}
}

// Handle notification opened app from background state
export function handleNotificationResponse(
	response: Notifications.NotificationResponse,
) {
	debugLog("🔔 NOTIFICATION RESPONSE", {
		actionIdentifier: response.actionIdentifier,
		notification: {
			title: response.notification.request.content.title,
			body: response.notification.request.content.body,
			data: response.notification.request.content.data,
		},
	});

	// Handle the notification based on type
	const data = response.notification.request.content.data;

	console.log("NOTIFICATION RESPONSE DATA", data);
}

// Handle notification received while app is in foreground
export function handleNotificationReceived(
	notification: Notifications.Notification,
) {
	debugLog("🔔 NOTIFICATION RECEIVED", {
		title: notification.request.content.title,
		body: notification.request.content.body,
		data: notification.request.content.data,
		date: notification.date,
	});
}
