import { supabase } from "@/lib/supabase";
import { useGetSession } from "@/network/session";
import { useFetchUserProfile } from "@/network/user-profile";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";
import { SkeletonText } from "../ui/skeleton-text";
import { NotificationIcon } from "../vectors/notification-icon";
export const SettingsComponent = () => {
	const { data: session, isLoading: isSessionLoading } = useGetSession();
	const { data: profile, isLoading: isProfileLoading } = useFetchUserProfile();

	const handleLogout = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;

			router.replace("/auth");
		} catch (error) {
			console.error("Error logging out:", error);
		}
	};

	const confirmLogout = () => {
		Alert.alert("Confirmation", "Êtes-vous sûr de vouloir vous déconnecter?", [
			{
				text: "Annuler",
				style: "cancel",
			},
			{
				text: "Se déconnecter",
				onPress: handleLogout,
				style: "destructive",
			},
		]);
	};

	if (isSessionLoading || isProfileLoading) {
		return <SkeletonText width="w-full" />;
	}

	return (
		<View className="flex-1 bg-black text-white py-2 px-safe-offset-4">
			<View className="flex items-start gap-4 h-fit py-2 border-b border-zinc-800">
				<Text className="text-xl text-white font-bold">
					Informaiton de Profil
				</Text>
				<View className="flex items-start gap-3 py-2 w-full">
					<View className="flex gap-1">
						<Text className="text-white text-xl">Coordonnées</Text>
						<Text className="text-zinc-400">
							{session?.user.email || "Aucune adresse email"}
						</Text>
					</View>
					<View className="flex gap-1">
						<Text className="text-white text-xl">Année de naissance</Text>
						<Text className="text-zinc-400">
							{profile?.birth_year || "Aucune année de naissance"}
						</Text>
					</View>
				</View>
			</View>
			<View className="flex items-start gap-3 h-fit py-2 border-b border-zinc-800">
				<Text className="text-lg text-zinc-400 pt-2">Gérer votre compte</Text>
				<Pressable
					onPress={() =>
						router.replace({
							pathname: "/(tabs)/notification-preferences",
							params: {
								userId: profile?.user_id,
								previousScreen: "/(tabs)/settings",
							},
						})
					}
				>
					{({ pressed }) => (
						<View
							className="w-full flex-row justify-between items-center"
							style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
						>
							<View className="flex-row items-center gap-2">
								<NotificationIcon fill="#fff" />
								<Text className="text-white text-xl ">Notifications</Text>
							</View>
							<Ionicons
								name="chevron-forward-outline"
								size={24}
								color="white"
							/>
						</View>
					)}
				</Pressable>
			</View>
			<View className="flex items-start gap-3 h-fit py-2 border-b border-zinc-800">
				<Text className="text-lg text-zinc-400 pt-2">Plus d'infos</Text>
				<Pressable disabled className="opacity-50">
					{({ pressed }) => (
						<View
							className="w-full flex-row justify-between items-center"
							style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
						>
							<View className="flex-row items-center gap-2">
								<Ionicons
									name="information-circle-outline"
									size={24}
									color="white"
								/>
								<Text className="text-white text-xl ">À Propos</Text>
							</View>
							<Ionicons
								name="chevron-forward-outline"
								size={24}
								color="white"
							/>
						</View>
					)}
				</Pressable>
			</View>
			<View className="flex items-start gap-3 h-fit py-2 border-b border-zinc-800">
				<Text className="text-lg text-zinc-400 pt-2">Connexion</Text>
				<Pressable onPress={confirmLogout}>
					{({ pressed }) => (
						<View
							className="w-full flex-row justify-between items-center"
							style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
						>
							<Text className="text-red-500 text-xl ">Se déconnecter</Text>
						</View>
					)}
				</Pressable>
			</View>
		</View>
	);
};
