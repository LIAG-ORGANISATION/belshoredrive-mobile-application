import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const EXPO_ACCESS_TOKEN = Deno.env.get("EXPO_ACCESS_TOKEN");
const SUPABASE_URL = Deno.env.get("API_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
	const { type, recipient_id, data } = await req.json();

	// Get user's push token
	const { data: profile } = await supabase
		.from("user_profiles")
		.select("expo_push_token")
		.eq("user_id", recipient_id)
		.single();

	if (!profile?.expo_push_token) {
		return new Response("No push token found", { status: 400 });
	}

	// Prepare notification content based on type
	let title, body;
	switch (type) {
		case "new_comment":
			title = "New Comment";
			body = `${data.commenter_name} commented on your vehicle`;
			break;
		case "new_follower":
			title = "New Follower";
			body = `${data.follower_name} started following you`;
			break;
		case "new_vehicle":
			title = "New Vehicle";
			body = `${data.user_name} added a new vehicle`;
			break;
		case "new_message":
			title = "New Message";
			body = `${data.sender_name} sent you a message`;
			break;
		case "new_rating":
			title = "New Rating";
			body = `${data.rater_name} rated your vehicle`;
			break;
	}

	// Send to Expo push notification service
	const message = {
		to: profile.expo_push_token,
		sound: "default",
		title,
		body,
		data,
	};

	await fetch("https://exp.host/--/api/v2/push/send", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Accept-encoding": "gzip, deflate",
			"Content-Type": "application/json",
			Authorization: `Bearer ${EXPO_ACCESS_TOKEN}`,
		},
		body: JSON.stringify(message),
	});

	// Store notification in database
	await supabase.from("notifications").insert({
		user_id: recipient_id,
		type,
		title,
		body,
		data,
	});

	return new Response("OK", { status: 200 });
});
