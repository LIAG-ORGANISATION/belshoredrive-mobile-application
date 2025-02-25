import { Text, View } from "react-native";

export default function Verification() {
	return (
		<View className="flex-1 bg-black items-center justify-center">
			<Text className="text-white text-2xl font-bold">
				Vérification de l'email
			</Text>
			<Text className="text-white text-lg">
				Veuillez vérifier votre boite email pour continuer.
			</Text>
		</View>
	);
}
