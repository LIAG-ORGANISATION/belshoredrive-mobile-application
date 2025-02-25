import { Text, View } from "react-native";

export default function Calendar() {
	return (
		<View className="flex-1 bg-black items-center justify-center">
			<Text className="text-gray-400 text-2xl font-bold">Events</Text>
			<Text className="text-gray-400 text-lg">
				Les événements ne sont pas encore disponibles.
			</Text>
		</View>
	);
}
