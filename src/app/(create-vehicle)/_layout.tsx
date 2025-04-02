import { ProgressBar } from "@/components/ui/progress-bar";
import { useDeleteVehicle } from "@/network/vehicles";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";

export default function CreateVehicleLayout() {
	const { mutate: deleteVehicle } = useDeleteVehicle();
	const { vehicleId } = useLocalSearchParams();

	const handleDeleteVehicle = async () => {
		await deleteVehicle(vehicleId as string);
		router.push("/(tabs)");
	};

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
				name="[vehicleId]/upload"
				options={{
					headerShown: true,
					headerStyle: { backgroundColor: "#000" },
					headerTitle: () => <ProgressBar currentStep={0} totalSteps={5} />,
					headerLeft: () => (
						<Ionicons
							name="close"
							size={24}
							color="white"
							onPress={() =>
								router.replace({
									pathname: "/(tabs)/profile",
								})
							}
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
					headerRight: () => (
						<Ionicons
							name="trash-outline"
							size={24}
							color="white"
							onPress={handleDeleteVehicle}
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
					headerRight: () => (
						<Ionicons
							name="trash-outline"
							size={24}
							color="white"
							onPress={handleDeleteVehicle}
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
					headerRight: () => (
						<Ionicons
							name="trash-outline"
							size={24}
							color="white"
							onPress={handleDeleteVehicle}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="[vehicleId]/parts-details"
				options={{
					headerShown: true,
					headerStyle: { backgroundColor: "#000" },
					headerTitle: () => <ProgressBar currentStep={4} totalSteps={5} />,
					headerLeft: () => (
						<Ionicons
							name="arrow-back"
							size={24}
							color="white"
							onPress={() => router.back()}
						/>
					),
					headerRight: () => (
						<Ionicons
							name="trash-outline"
							size={24}
							color="white"
							onPress={handleDeleteVehicle}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="[vehicleId]/view"
				options={{
					headerShown: true,
					headerStyle: { backgroundColor: "#000" },
					headerTitle: () => <ProgressBar currentStep={5} totalSteps={5} />,
					headerLeft: () => (
						<Ionicons
							name="arrow-back"
							size={24}
							color="white"
							onPress={() => router.back()}
						/>
					),
					headerRight: () => (
						<Ionicons
							name="trash-outline"
							size={24}
							color="white"
							onPress={handleDeleteVehicle}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="[vehicleId]/gallery"
				options={{
					headerShown: true,
					headerStyle: { backgroundColor: "#000" },
					headerTitle: () => <ProgressBar currentStep={5} totalSteps={5} />,
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
