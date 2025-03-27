import {
	type VehicleDetailsType,
	vehicleDetailsSchema,
} from "@/lib/schemas/create-vehicle";
import {
	useFetchMotorizationTypes,
	useFetchTransmissionTypes,
	useFetchVehicleById,
	useUpdateVehicle,
} from "@/network/vehicles";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	Text,
	View,
} from "react-native";
import { ScrollView } from "react-native";

import { Button } from "@/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Input } from "../ui/text-input";

export const VehicleDetails = ({
	onSuccess,
	vehicleId,
}: { onSuccess: () => void; vehicleId: string }) => {
	const { data: vehicle } = useFetchVehicleById(vehicleId);
	const { mutate: updateVehicle } = useUpdateVehicle();
	const { data: motorizationTypes } = useFetchMotorizationTypes(
		vehicle?.type_id,
	);
	const { data: transmissionTypes } = useFetchTransmissionTypes(
		vehicle?.type_id,
	);

	const {
		control,
		handleSubmit,
		getValues,
		formState: { errors, isValid, isSubmitting },
		reset,
	} = useForm<VehicleDetailsType>({
		resolver: valibotResolver(vehicleDetailsSchema),
		defaultValues: {
			mileage: 0,
			power: 0,
			transmission_id: "",
			motorization_id: "",
			max_speed: 0,
			purchase_date: "",
			driving_side: "",
		},
		mode: "onBlur",
		criteriaMode: "all",
	});

	useEffect(() => {
		if (vehicle) {
			reset({
				mileage: vehicle.mileage ? vehicle.mileage.toString() : 0,
				power: vehicle.power ? vehicle.power.toString() : 0,
				transmission_id: vehicle.transmission_id || "",
				motorization_id: vehicle.motorization_id || "",
				max_speed: vehicle.max_speed ? vehicle.max_speed.toString() : 0,
				purchase_date: vehicle.purchase_date
					? `${new Date(vehicle.purchase_date).getFullYear()}-01-01`
					: "",
				driving_side: vehicle.driving_side || "",
			});
		}
	}, [vehicle]);

	const [showMotorizationPicker, setShowMotorizationPicker] = useState(false);
	const [showTransmissionPicker, setShowTransmissionPicker] = useState(false);
	const [showDriveSidePicker, setShowDriveSidePicker] = useState(false);
	const [showPurchaseDatePicker, setShowPurchaseDatePicker] = useState(false);

	const onSubmit = async (data: VehicleDetailsType) => {
		try {
			await updateVehicle(
				{
					vehicleId,
					updates: {
						mileage: data.mileage,
						power: data.power,
						transmission_id: data.transmission_id,
						motorization_id: data.motorization_id,
						max_speed: data.max_speed,
						purchase_date: new Date(data.purchase_date as string).toISOString(),
						driving_side: data.driving_side,
					},
				},
				{
					onSuccess: () => {
						onSuccess();
					},
					onError: (error) => {
						console.error("Failed to update vehicle:", error);
					},
				},
			);
		} catch (error) {
			console.error("Failed to update profile:", error);
		}
	};

	if (!transmissionTypes || !motorizationTypes || !vehicle) {
		return <Text className="text-white text-lg">Chargement...</Text>;
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			className="flex-1"
		>
			<View
				className={
					"w-full h-fit max-h-screen flex-1 items-start justify-between pb-safe-offset-4 bg-black"
				}
			>
				<ScrollView
					className="w-full flex-1 flex-col gap-4"
					contentContainerStyle={{ gap: 16 }}
				>
					<View className="flex-col w-full gap-1 ">
						<Text className="text-white text-base font-semibold">
							Kilométrage
						</Text>
						<View className="w-full h-fit flex flex-row justify-between items-center gap-2">
							<View className="flex-1">
								<Controller<VehicleDetailsType>
									control={control}
									name="mileage"
									render={({ field: { onChange, onBlur, value } }) => (
										<Input
											placeholder="Kilométrage"
											name="mileage"
											keyboardType="numeric"
											value={value as string}
											onChangeText={(value) =>
												onChange(Number(value.replace(/[^0-9]/g, "")))
											}
											onBlur={onBlur}
											placeholderTextColor="white"
											error={errors.mileage}
										/>
									)}
								/>
							</View>
							<Text className="text-white text-lg">km</Text>
						</View>
					</View>
					<View className="flex-col w-full gap-1 ">
						<Text className="text-white text-base font-semibold">
							Puissance
						</Text>
						<View className="w-full h-fit flex flex-row justify-between items-center gap-2">
							<View className="flex-1">
								<Controller<VehicleDetailsType>
									control={control}
									name="power"
									render={({ field: { onChange, onBlur, value } }) => (
										<Input
											placeholder="Puissance"
											name="power"
											keyboardType="numeric"
											value={value as string}
											onChangeText={(value) =>
												onChange(Number(value.replace(/[^0-9]/g, "")))
											}
											onBlur={onBlur}
											placeholderTextColor="white"
											error={errors.power}
										/>
									)}
								/>
							</View>
							<Text className="text-white text-lg">ch</Text>
						</View>
					</View>
					<View className="flex-col w-full gap-1 ">
						<Text className="text-white text-base font-semibold">
							Type de boite
						</Text>
						<Controller<VehicleDetailsType>
							control={control}
							name="transmission_id"
							render={({ field: { onChange, onBlur, value } }) => (
								<Fragment>
									<Pressable
										className="w-full h-12 border flex flex-row items-center justify-between border-white/20  bg-white/15 rounded-lg px-4"
										onPress={() => setShowTransmissionPicker(true)}
									>
										<Text
											className={`text-sm ${
												!value ? "text-white/50" : "text-white"
											}`}
										>
											{value
												? transmissionTypes?.find(
														(transmission) =>
															transmission.transmission_id === value,
													)?.name
												: "Type de boite"}
										</Text>
										<Ionicons name="chevron-down" size={24} color="white" />
									</Pressable>

									<Modal
										visible={showTransmissionPicker}
										transparent={true}
										animationType="slide"
									>
										<View className="flex-1 justify-end bg-black/50">
											<View className="bg-zinc-900 w-full">
												<View className="flex-row justify-end p-4 border-b border-white/20">
													<Pressable
														onPress={() => {
															setShowTransmissionPicker(false);
															if (value === "") {
																onChange(transmissionTypes[0].transmission_id);
															}
														}}
													>
														<Text className="text-white font-bold">Fermer</Text>
													</Pressable>
												</View>
												<Picker
													mode="dropdown"
													itemStyle={{
														color: "white",
														fontSize: 16,
														fontWeight: "bold",
													}}
													selectedValue={value}
													onValueChange={(itemValue) => {
														onChange(itemValue);
													}}
												>
													{transmissionTypes?.map((transmission) => (
														<Picker.Item
															key={transmission.transmission_id}
															label={transmission.name}
															value={transmission.transmission_id}
														/>
													))}
												</Picker>
											</View>
										</View>
									</Modal>
								</Fragment>
							)}
						/>
					</View>
					<View className="flex-col w-full gap-1 ">
						<Text className="text-white text-base font-semibold">
							Motorisation
						</Text>

						<Controller<VehicleDetailsType>
							control={control}
							name="motorization_id"
							render={({ field: { onChange, onBlur, value } }) => (
								<Fragment>
									<Pressable
										className="w-full h-12 border flex flex-row items-center justify-between border-white/20  bg-white/15 rounded-lg  px-4"
										onPress={() => setShowMotorizationPicker(true)}
									>
										<Text
											className={`text-sm ${
												!motorizationTypes?.find(
													(motorization) =>
														motorization.motorization_id === value,
												)?.name
													? "text-white/50"
													: "text-white"
											}`}
										>
											{motorizationTypes?.find(
												(motorization) =>
													motorization.motorization_id === value,
											)?.name || "Motorisation"}
										</Text>
										<Ionicons name="chevron-down" size={24} color="white" />
									</Pressable>

									<Modal
										visible={showMotorizationPicker}
										transparent={true}
										animationType="slide"
									>
										<View className="flex-1 justify-end bg-black/50">
											<View className="bg-zinc-900 w-full">
												<View className="flex-row justify-end p-4 border-b border-white/20">
													<Pressable
														onPress={() => {
															setShowMotorizationPicker(false);
															if (value === "") {
																onChange(motorizationTypes[0].motorization_id);
															}
														}}
													>
														<Text className="text-white font-bold">Fermer</Text>
													</Pressable>
												</View>
												<Picker
													mode="dropdown"
													itemStyle={{
														color: "white",
														fontSize: 16,
														fontWeight: "bold",
													}}
													selectedValue={value}
													onValueChange={(itemValue) => {
														onChange(itemValue);
													}}
												>
													{motorizationTypes?.map((motorization) => (
														<Picker.Item
															key={motorization.motorization_id}
															label={motorization.name}
															value={motorization.motorization_id}
														/>
													))}
												</Picker>
											</View>
										</View>
									</Modal>
								</Fragment>
							)}
						/>
					</View>
					<View className="flex-col w-full gap-1 ">
						<Text className="text-white text-base font-semibold">
							Vitesse max
						</Text>
						<View className="w-full h-fit flex flex-row justify-between items-center gap-2">
							<View className="flex-1">
								<Controller<VehicleDetailsType>
									control={control}
									name="max_speed"
									render={({ field: { onChange, onBlur, value } }) => (
										<Input
											placeholder="Vitesse max"
											name="max_speed"
											keyboardType="numeric"
											value={value as string}
											onChangeText={(value) =>
												onChange(Number(value.replace(/[^0-9]/g, "")))
											}
											onBlur={onBlur}
											placeholderTextColor="white"
											error={errors.max_speed}
										/>
									)}
								/>
							</View>
							<Text className="text-white text-lg">km/h</Text>
						</View>
					</View>
					<View className="flex-col w-full gap-1 ">
						<Text className="text-white text-base font-semibold">
							Côté de conduite
						</Text>
						<View className="w-full h-fit flex flex-row justify-between items-center gap-2">
							<View className="flex-1">
								<Controller<VehicleDetailsType>
									control={control}
									name="driving_side"
									render={({ field: { onChange, value } }) => (
										<Fragment>
											<Pressable
												onPress={() => setShowDriveSidePicker(true)}
												className="w-full h-12 px-4 rounded-lg bg-neutral-800 flex flex-row items-center justify-between"
											>
												<Text
													className={`text-sm ${
														!value ? "text-white/50" : "text-white"
													}`}
												>
													{(value as string) || "Côté de conduite"}
												</Text>
												<Ionicons name="chevron-down" size={24} color="white" />
											</Pressable>
											<Modal
												visible={showDriveSidePicker}
												transparent={true}
												animationType="slide"
											>
												<View className="flex-1 justify-end bg-black/50">
													<View className="w-full bg-neutral-800 rounded-t-lg">
														<View className="flex-row justify-between items-center p-4 border-b border-neutral-700">
															<Text className="text-white text-lg font-semibold">
																Côté de conduite
															</Text>
															<Pressable
																onPress={() => {
																	setShowDriveSidePicker(false);
																	if (value === "") {
																		onChange("right");
																	}
																}}
															>
																<Text className="text-white font-bold">
																	Fermer
																</Text>
															</Pressable>
														</View>
														<Picker
															itemStyle={{
																color: "white",
																fontSize: 16,
																fontWeight: "bold",
															}}
															selectedValue={value}
															onValueChange={(itemValue) => {
																onChange(itemValue);
															}}
														>
															<Picker.Item
																label="Conduite à droite"
																value="right"
															/>
															<Picker.Item
																label="Conduite à gauche"
																value="left"
															/>
														</Picker>
													</View>
												</View>
											</Modal>
										</Fragment>
									)}
								/>
							</View>
						</View>
					</View>

					<View className="flex-col w-full gap-1">
						<Text className="text-white text-base font-semibold">
							Date d'achat
						</Text>
						<View className="w-full h-fit flex flex-row justify-between items-center gap-2">
							<View className="flex-1">
								<Controller<VehicleDetailsType>
									control={control}
									name="purchase_date"
									render={({ field: { onChange, value } }) => (
										<Fragment>
											<Pressable
												onPress={() => setShowPurchaseDatePicker(true)}
												className="w-full h-12 px-4 rounded-lg bg-neutral-800 flex flex-row items-center justify-between"
											>
												<Text
													className={`text-sm ${
														!value ? "text-white/50" : "text-white"
													}`}
												>
													{value === "" || value === null
														? "Date d'achat"
														: new Date(value as string).getFullYear()}
												</Text>
												<Ionicons name="chevron-down" size={24} color="white" />
											</Pressable>
											<Modal
												visible={showPurchaseDatePicker}
												transparent={true}
												animationType="slide"
											>
												<View className="flex-1 justify-end bg-black/50">
													<View className="bg-zinc-900 w-full">
														<View className="flex-row justify-end p-4 border-b border-white/20">
															<Pressable
																onPress={() => {
																	setShowPurchaseDatePicker(false);
																	if (value === "" || value === null) {
																		onChange(
																			`${new Date().getFullYear()}-01-01`,
																		);
																	}
																}}
															>
																<Text className="text-white font-bold">
																	Fermer
																</Text>
															</Pressable>
														</View>
														<Picker
															mode="dropdown"
															itemStyle={{
																color: "white",
																fontSize: 16,
																fontWeight: "bold",
															}}
															selectedValue={value}
															onValueChange={(itemValue) => {
																onChange(itemValue);
															}}
														>
															{Array.from({ length: 100 }, (_, i) => (
																<Picker.Item
																	key={`${new Date().getFullYear() - i}`}
																	label={`${new Date().getFullYear() - i}`}
																	value={`${new Date().getFullYear() - i}-01-01`}
																/>
															))}
														</Picker>
													</View>
												</View>
											</Modal>
										</Fragment>
									)}
								/>
							</View>
						</View>
						<Button
							className="w-full mt-4"
							variant="secondary"
							label="Continuer"
							onPress={handleSubmit(onSubmit)}
						/>
					</View>
				</ScrollView>
			</View>
		</KeyboardAvoidingView>
	);
};
