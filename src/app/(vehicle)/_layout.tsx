import { useGetSession } from "@/network/session";
import { useDeleteVehicle, useFetchVehicleById } from "@/network/vehicles";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { Text, View } from "react-native";

export default function VehicleProfileLayout() {
	const [title, setTitle] = useState("");
	const { data: session } = useGetSession();
	const { vehicleId, previousScreen, userId } = useLocalSearchParams();
	const { data: vehicle } = useFetchVehicleById(vehicleId as string);
	const { mutate: deleteVehicle } = useDeleteVehicle();

	const handleDeleteVehicle = () => {
		deleteVehicle(vehicleId as string);
		router.push("/(tabs)");
	};

	useLayoutEffect(() => {
		if (!vehicle) return;
		setTitle(`${vehicle.year} ${vehicle.brands?.name} ${vehicle.model}`);
	}, [vehicle]);

	console.log(previousScreen);

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
								name="chevron-back"
								size={24}
								style={{ color: "white", paddingRight: 10 }}
								onPress={() => {
									if (previousScreen) {
										router.push({
											pathname: previousScreen as string,
											params: {
												userId,
											},
										});
									} else {
										router.back();
									}
								}}
							/>
						),
						headerRight: () =>
							vehicle?.user_id === session?.user.id && (
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
