import {
	type NotificationsPreferences,
	notificationsPreferencesSchema,
} from "@/lib/schemas/notifications-preferences";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { ToggleOption } from "../ui/toggle-option";

export function NotificationPreferencesComponent() {
	const {
		formState: { errors, isSubmitting },
		setValue,
		watch,
	} = useForm<NotificationsPreferences>({
		resolver: valibotResolver(notificationsPreferencesSchema),
		criteriaMode: "all",
		defaultValues: {
			new_follower: false,
			new_vehicle_followed: false,
			new_message: false,
			comment_received: false,
		},
		mode: "onChange",
	});

	const preferences = watch();

	const handleSave = async (data: NotificationsPreferences) => {
		console.log(data);
	};

	return (
		<View className="flex-1 bg-black text-white py-2 ">
			<View className="flex py-2 gap-4 px-safe-offset-4">
				<Text className="text-2xl font-bold text-white">
					Notifications push
				</Text>
				<ToggleOption
					isTop
					title="Nouvelles follower"
					description="Recevez une alerte quand quelqu'un vous suit."
					isEnabled={preferences.new_follower}
					toggleSwitch={() => {
						setValue("new_follower", !preferences.new_follower);
						handleSave(preferences);
					}}
				/>
				<ToggleOption
					title="Nouveau vehicule suivi"
					description="Soyez informé quand un utilisateur que vous suivez ajoute un véhicule."
					isEnabled={preferences.new_vehicle_followed}
					toggleSwitch={() => {
						setValue("new_vehicle_followed", !preferences.new_vehicle_followed);
						handleSave(preferences);
					}}
				/>
				<ToggleOption
					title="Nouveau message"
					description="Recevez une notification pour chaque message reçu."
					isEnabled={preferences.new_message}
					toggleSwitch={() => {
						setValue("new_message", !preferences.new_message);
						handleSave(preferences);
					}}
				/>
				<ToggleOption
					title="Commentaire reçu"
					description="Soyez alerté quand quelqu’un commente un de vos véhicules."
					isEnabled={preferences.comment_received}
					toggleSwitch={() => {
						setValue("comment_received", !preferences.comment_received);
						handleSave(preferences);
					}}
				/>
			</View>
		</View>
	);
}
