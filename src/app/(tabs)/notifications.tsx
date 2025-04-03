import { Notification } from "@/components/ui/notification";
import { useUserNotifications } from "@/network/notifications";
import { useGetSession } from "@/network/session";
import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { RefreshControl, Text, View } from "react-native";

export default function Notifications() {
	const { data: session } = useGetSession();
	const [refreshing, setRefreshing] = useState(false);

	const { data: notifications = [], refetch } = useUserNotifications(
		session?.user.id || "",
	);

	const handleRefresh = async () => {
		setRefreshing(true);
		await refetch();
		setRefreshing(false);
	};

	return (
		<View className="flex-1 bg-black text-white py-2 px-safe-offset-2">
			<Text className="text-xl font-bold text-white">
				Dernières notifications
			</Text>
			{notifications?.length === 0 ? (
				<Text className="text-center text-gray-400">Aucune notification</Text>
			) : (
				<FlashList
					data={notifications}
					estimatedItemSize={70}
					renderItem={({ item }) => <Notification {...item} />}
					refreshing={refreshing}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={handleRefresh}
							tintColor="white"
						/>
					}
				/>
			)}
		</View>
	);
}
