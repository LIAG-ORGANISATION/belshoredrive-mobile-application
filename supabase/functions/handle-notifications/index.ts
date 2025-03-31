import { createClient } from "jsr:@supabase/supabase-js@2";
interface Notification {
	id: string;
	user_id: string;
	title: string;
	body: string;
	data: {
		vehicle_id: string;
		comment_id: string;
		commenter_id: string;
		content: string;
	};
}

interface WebhookPayload {
	type: "INSERT" | "UPDATE" | "DELETE";
	table: string;
	record: Notification;
	schema: "public";
	old_record: null | Notification;
}

const supabase = createClient(
	Deno.env.get("SUPABASE_URL")!,
	Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
	try {
		const payload: WebhookPayload = await req.json();

		// Only process new notifications
		if (payload.type !== "INSERT") {
			return new Response(
				JSON.stringify({ message: "Not a new notification" }),
				{
					status: 200,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		// Get the user's expo push token
		const { data: userData } = await supabase
			.from("user_profiles")
			.select("expo_push_token, pseudo")
			.eq("user_id", payload.record.user_id)
			.single();

		if (!userData?.expo_push_token) {
			return new Response(JSON.stringify({ message: "No push token found" }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		}

		// Send the push notification
		const response = await fetch("https://exp.host/--/api/v2/push/send", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${Deno.env.get("EXPO_ACCESS_TOKEN")}`,
			},
			body: JSON.stringify({
				to: userData.expo_push_token,
				title: payload.record.title,
				body: payload.record.body,
				data: payload.record.data,
				sound: "default",
			}),
		});

		const result = await response.json();

		return new Response(JSON.stringify(result), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}
});
