import { type InferOutput, boolean, object } from "valibot";

export const notificationsPreferencesSchema = object({
	new_follower: boolean(),
	new_vehicle_followed: boolean(),
	new_message: boolean(),
	comment_received: boolean(),
});

export type NotificationsPreferences = InferOutput<
	typeof notificationsPreferencesSchema
>;
