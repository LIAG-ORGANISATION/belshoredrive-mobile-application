import { formatPicturesUri } from "@/lib/helpers/format-pictures-uri";
import { useMarkNotificationAsRead } from "@/network/notifications";
import { useFetchUserProfileById } from "@/network/user-profile";
import type { Json, Tables } from "@/types/supabase";
import dayjs from "dayjs";
import { type Href, router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

type NotificationProps = Tables<"notifications">;

const returnUserId = (type: NotificationProps["type"], data: Json) => {
	if (!data) return "";

	if (type === "follow") {
		return data.followerId;
	}

	if (type === "comment") {
		return data.commenterId;
	}
	if (type === "rating") {
		return data.raterId;
	}
};

const returnLink = (type: NotificationProps["type"], data: Json): Href => {
	if (type === "comment" || type === "rating")
		return {
			pathname: `/(vehicle)/[vehicleId]`,
			params: {
				vehicleId: data?.vehicleId,
				initialTab: type === "comment" ? 2 : 0,
				previousScreen: "/(tabs)/notifications",
			},
		};

	if (type === "follow")
		return {
			pathname: `/(tabs)/user`,
			params: {
				userId: data?.followerId,
				previousScreen: "/(tabs)/notifications",
			},
		};
	return { pathname: "/(tabs)" };
};

export const Notification = ({
	id,
	body,
	created_at,
	type,
	data,
	read,
}: NotificationProps) => {
	const { data: user } = useFetchUserProfileById(returnUserId(type, data));
	const { mutate: markNotificationAsRead } = useMarkNotificationAsRead();
	if (type === "chat") return null;

	return (
		<TouchableOpacity
			className="py-4 flex flex-row justify-between items-center"
			onPress={() => {
				console.log("id", id);
				markNotificationAsRead(id, {
					onSuccess: () => {
						router.replace(returnLink(type, data));
					},
				});
			}}
		>
			<View className="flex flex-row items-center gap-4">
				<Image
					source={{
						uri: formatPicturesUri(
							"profile_pictures",
							user?.profile_picture_url || "",
						),
					}}
					className="w-8 h-8 rounded-full"
				/>
				<View className="flex flex-col gap-1">
					<Text className="text-white text-sm font-semibold text-wrap">
						{body}
					</Text>
					<Text className="text-gray-400 text-sm">
						{dayjs(created_at).fromNow()}
					</Text>
				</View>
			</View>
			{!read && (
				<View className="bg-blue-500 rounded-full w-1.5 h-1.5 flex items-center justify-center">
					<Text className="text-white text-sm"></Text>
				</View>
			)}
		</TouchableOpacity>
	);
};
