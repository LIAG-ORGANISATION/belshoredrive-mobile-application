import { useFetchVehicleById } from "@/network/vehicles";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { Text, View } from "react-native";

export default function VehicleProfileLayout() {
	const { vehicleId } = useLocalSearchParams();
	const { data: vehicle } = useFetchVehicleById(vehicleId as string);
	const [title, setTitle] = useState("");
	useLayoutEffect(() => {
		if (!vehicle) return;
		setTitle(`${vehicle.year} ${vehicle.brands?.name} ${vehicle.model}`);
	}, [vehicle]);
	return (
		<View className="flex-1 bg-black">
			<Stack
				screenOptions={{
					headerShown: false,
					headerTintColor: "white",
					headerStyle: { backgroundColor: "#000" },
				}}
			>
				<Stack.Screen
					name="[vehicleId]/index"
					options={{
						headerShown: true,
						headerTitle: () => (
							<Text className="text-white font-bold text-xl">{title}</Text>
						),
						headerLeft: () => (
							<Ionicons
								name="close"
								size={24}
								style={{ color: "white", paddingRight: 10 }}
								onPress={() => router.replace("/(tabs)")}
							/>
						),
					}}
				/>
				<Stack.Screen
					name="[vehicleId]/gallery"
					options={{
						headerShown: true,
						headerTitle: () => <Text className="text-white">{title}</Text>,
						headerLeft: () => (
							<Ionicons
								name="chevron-back"
								size={24}
								style={{ color: "white", paddingRight: 10 }}
								onPress={() => router.back()}
							/>
						),
					}}
				/>
			</Stack>
		</View>
	);
}
