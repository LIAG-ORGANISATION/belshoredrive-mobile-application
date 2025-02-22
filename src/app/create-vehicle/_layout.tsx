import { ProgressBar } from "@/components/ui/progress-bar";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";

export default function CreateVehicleLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					headerShown: true,
					headerStyle: { backgroundColor: "#000" },
					headerTitle: () => <ProgressBar currentStep={1} totalSteps={5} />,
					headerLeft: () => (
						<Ionicons
							name="close"
							size={24}
							color="white"
							onPress={() => router.push("/(tabs)")}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="[vehicleId]/index"
				options={{
					headerShown: true,
					headerStyle: { backgroundColor: "#000" },
					headerTitle: () => <ProgressBar currentStep={2} totalSteps={5} />,
					headerLeft: () => (
						<Ionicons
							name="close"
							size={24}
							color="white"
							onPress={() => router.push("/(tabs)")}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="[vehicleId]/choose-brand"
				options={{
					headerShown: true,
					headerStyle: { backgroundColor: "#000" },
					headerTitle: () => <ProgressBar currentStep={2} totalSteps={5} />,
					headerLeft: () => (
						<Ionicons
							name="close"
							size={24}
							color="white"
							onPress={() => router.back()}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="[vehicleId]/tags"
				options={{
					headerShown: true,
					headerStyle: { backgroundColor: "#000" },
					headerTitle: () => <ProgressBar currentStep={2} totalSteps={5} />,
					headerLeft: () => (
						<Ionicons
							name="arrow-back"
							size={24}
							color="white"
							onPress={() => router.back()}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="[vehicleId]/vehicle-details"
				options={{
					headerShown: true,
					headerStyle: { backgroundColor: "#000" },
					headerTitle: () => <ProgressBar currentStep={3} totalSteps={5} />,
					headerLeft: () => (
						<Ionicons
							name="arrow-back"
							size={24}
							color="white"
							onPress={() => router.back()}
						/>
					),
				}}
			/>
		</Stack>
	);
}
