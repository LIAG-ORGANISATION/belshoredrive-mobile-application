import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/vectors/close-icon";
import { type Href, router } from "expo-router";
import { Text, View } from "react-native";

export const CompleteProfileCta = ({ step }: { step: string }) => {
	return (
		<View className="w-full mx-safe-offset-6 bg-white/20 p-4 rounded-lg flex-col gap-2 mb-4">
			<View className="w-full flex-row items-center justify-between">
				<Text className="text-xl font-bold text-white">Bienvenue à bord !</Text>
				<View className="flex-row items-center gap-2">
					<CloseIcon />
				</View>
			</View>
			<View className="w-full flex-row items-center justify-between">
				<Text className="text-base text-white font-semibold">
					Utilisez l'app et complétez votre profil pour apparaître et matcher
					avec des personnes partageant vos passions !
				</Text>
			</View>
			<Button
				variant="secondary"
				onPress={() => {
					router.replace(step as Href);
				}}
				label="Compléter mon profil"
			/>
		</View>
	);
};
