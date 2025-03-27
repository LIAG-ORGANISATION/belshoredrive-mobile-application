import { createClient } from "jsr:@supabase/supabase-js@2";

interface Notification {
	type:
		| "new_follower"
		| "new_vehicle"
		| "new_message"
		| "new_rating"
		| "new_comment";
	recipient_id: string;
	data: {
		[key: string]: any;
	};
}

Deno.serve(async (req) => {
	try {
		const payload: Notification = await req.json();

		// Validate payload
		if (!payload.type || !payload.recipient_id) {
			return new Response("Missing required fields", { status: 400 });
		}

		const supabase = createClient(
			Deno.env.get("SUPABASE_URL") ?? "",
			Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
			{
				auth: {
					persistSession: false,
				},
			},
		);

		// Get user's push token
		const { data: profile, error: profileError } = await supabase
			.from("user_profiles")
			.select("expo_push_token")
			.eq("user_id", payload.recipient_id)
			.single();

		if (profileError) {
			console.error("Error fetching profile:", profileError);
			return new Response("Error fetching profile", { status: 400 });
		}

		// Prepare notification content
		let title: string;
		let body: string;

		switch (payload.type) {
			case "new_comment":
				title = "New Comment";
				body = `${payload.data.commenter_name} commented on your vehicle`;
				break;
			case "new_follower":
				title = "New Follower";
				body = `${payload.data.follower_name} started following you`;
				break;
			case "new_vehicle":
				title = "New Vehicle";
				body = `${payload.data.user_name} added a new vehicle`;
				break;
			case "new_message":
				title = "New Message";
				body = `${payload.data.sender_name} sent you a message`;
				break;
			case "new_rating":
				title = "New Rating";
				body = `${payload.data.rater_name} rated your vehicle`;
				break;
			default:
				title = "New Notification";
				body = "You have a new notification";
		}

		// Store notification in database
		const { error: notificationError } = await supabase
			.from("notifications")
			.insert({
				user_id: payload.recipient_id,
				title,
				body,
				type: payload.type,
				data: payload.data,
				read: false,
			});

		if (notificationError) {
			console.error("Error storing notification:", notificationError);
			return new Response("Error storing notification", { status: 500 });
		}

		// If user has a push token, send push notification
		if (profile?.expo_push_token) {
			const response = await fetch("https://exp.host/--/api/v2/push/send", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					"Accept-encoding": "gzip, deflate",
					Authorization: `Bearer ${Deno.env.get("EXPO_ACCESS_TOKEN")}`,
				},
				body: JSON.stringify({
					to: profile.expo_push_token,
					title,
					body,
					data: payload.data,
					sound: "default",
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				console.error("Expo push notification failed:", result);
				// Continue execution even if push notification fails
			}
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: "Notification stored and sent",
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	} catch (error) {
		console.error("Error in handle-notifications:", error);
		return new Response(error.message, { status: 500 });
	}
});
