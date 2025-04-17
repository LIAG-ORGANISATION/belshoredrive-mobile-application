import {
	type CreateVehicleType,
	createVehicleSchema,
} from "@/lib/schemas/create-vehicle";
import {
	useFetchVehicleById,
	useFetchVehicleStatuses,
	useUpdateVehicle,
} from "@/network/vehicles";
import { Ionicons } from "@expo/vector-icons";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
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
import { Button } from "../ui/button";
import { Input } from "../ui/text-input";

export const VehicleProfile = ({
	onSuccess,
	title,
	vehicleId,
}: { onSuccess: () => void; title?: string; vehicleId: string }) => {
	const { data: vehicle } = useFetchVehicleById(vehicleId);
	const { mutate: updateVehicle } = useUpdateVehicle();
	const { data: vehicleStatuses } = useFetchVehicleStatuses();

	const {
		control,
		handleSubmit,
		formState: { errors, isValid, isSubmitting },
		reset,
	} = useForm<CreateVehicleType>({
		resolver: valibotResolver(createVehicleSchema),
		defaultValues: {
			brand_id: "",
			model: "",
			year: 0,
			nickname: "",
			description: "",
			status_id: "",
		},
		mode: "onChange",
		criteriaMode: "all",
		delayError: 500,
	});

	const [isFormValid, setIsFormValid] = useState(false);

	useEffect(() => {
		if (vehicle) {
			reset({
				brand_id: vehicle.brand_id || "",
				model: vehicle.model || "",
				year: vehicle.year || 0,
				nickname: vehicle.nickname || "",
				description: vehicle.description || "",
				status_id: vehicle.status_id || "",
			});
		}
	}, [vehicle]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setIsFormValid(isValid);
		}, 1000);

		return () => clearTimeout(timeoutId);
	}, [isValid]);

	const [showPicker, setShowPicker] = useState(false);
	const [showStatusPicker, setShowStatusPicker] = useState(false);

	const onSubmit = async (data: CreateVehicleType) => {
		try {
			await updateVehicle(
				{
					vehicleId,
					updates: {
						brand_id: data.brand_id,
						model: data.model,
						year: data.year,
						nickname: data.nickname,
						description: data.description,
						status_id: data.status_id,
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

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			className="flex-1"
			keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
		>
			<ScrollView
				className="flex-1 bg-black"
				contentContainerStyle={{
					flexGrow: 1,
					paddingHorizontal: 16,
					paddingBottom: 24,
				}}
			>
				<View className="flex-1">
					<View className="w-full flex-col items-start justify-between gap-4">
						{title && (
							<Text className="text-white text-2xl font-bold">{title}</Text>
						)}
					</View>

					<View
						className="flex-1"
						style={{
							gap: 16,
						}}
					>
						<View className="flex-col w-full gap-1">
							<Text className="text-white text-lg font-semibold my-4">
								Décrivez le véhicule
							</Text>
							<Text className="text-white text-base font-semibold">Marque</Text>

							<Pressable
								className="w-full h-12 border flex flex-row border-white/20  bg-white/15 rounded-lg justify-between items-center px-4"
								onPress={() =>
									router.push({
										pathname: "/(create-vehicle)/[vehicleId]/choose-brand",
										params: { vehicleId: vehicleId as string },
									})
								}
							>
								<Text
									className={`${
										vehicle?.brands?.name ? "text-white" : "text-white/50"
									} text-base font-semibold`}
								>
									{vehicle?.brands?.name || "Marque"}
								</Text>
								<Ionicons
									name="add-circle-outline"
									size={24}
									color="white"
									onPress={() =>
										router.push({
											pathname: "/(create-vehicle)/[vehicleId]/choose-brand",
											params: { vehicleId: vehicleId as string },
										})
									}
								/>
							</Pressable>
						</View>

						<View className="flex-col w-full gap-1">
							<Text className="text-white text-base font-semibold">Modèle</Text>
							<Controller<CreateVehicleType>
								control={control}
								name="model"
								render={({ field: { onChange, onBlur, value } }) => (
									<Input
										placeholder="Modèle"
										name="model"
										value={value as string}
										onChangeText={onChange}
										onBlur={onBlur}
										placeholderTextColor="white"
										error={errors.model}
									/>
								)}
							/>
						</View>

						<View className="flex-col w-full gap-1">
							<Text className="text-white text-base font-semibold">Année</Text>
							<Controller<CreateVehicleType>
								control={control}
								name="year"
								render={({ field: { onChange, onBlur, value } }) => (
									<Fragment>
										<Pressable
											className="w-full h-12 border border-white/20  bg-white/15 rounded-lg justify-center px-4"
											onPress={() => setShowPicker(true)}
										>
											<Text
												className={`text-sm ${
													!value ? "text-white/50" : "text-white"
												}`}
											>
												{value ? String(value) : "Année"}
											</Text>
										</Pressable>

										<Modal
											visible={showPicker}
											transparent={true}
											animationType="slide"
										>
											<View className="flex-1 justify-end bg-black/50">
												<View className="bg-zinc-900 w-full">
													<View className="flex-row justify-end p-4 border-b border-white/20">
														<Pressable onPress={() => setShowPicker(false)}>
															<Text className="text-white font-bold">
																Valider
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
															onChange(Number(itemValue));
														}}
													>
														{Array.from({ length: 100 }, (_, i) => (
															<Picker.Item
																key={`${new Date().getFullYear() - i}`}
																label={`${new Date().getFullYear() - i}`}
																value={new Date().getFullYear() - i}
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

						<View className="flex-col w-full gap-1">
							<Text className="text-white text-base font-semibold">
								Surnom du véhicule
							</Text>
							<Controller<CreateVehicleType>
								control={control}
								name="nickname"
								render={({ field: { onChange, onBlur, value } }) => (
									<Input
										placeholder="Nickname"
										name="nickname"
										value={value as string}
										onChangeText={onChange}
										onBlur={onBlur}
										placeholderTextColor="white"
										error={errors.nickname}
									/>
								)}
							/>
						</View>

						<View className="flex-col w-full gap-1">
							<Text className="text-white text-base font-semibold">
								Description du véhicule
							</Text>
							<Controller<CreateVehicleType>
								control={control}
								name="description"
								render={({ field: { onChange, onBlur, value } }) => (
									<Input
										placeholder="Description du véhicule"
										name="description"
										value={value as string}
										onChangeText={onChange}
										classes="h-24"
										onBlur={onBlur}
										multiline={true}
										numberOfLines={4}
										textAlignVertical="top"
										placeholderTextColor="white"
										error={errors.description}
									/>
								)}
							/>
						</View>

						<View className="flex-col w-full gap-1">
							<Text className="text-white text-base font-semibold">
								Statut du véhicule
							</Text>
							<Controller<CreateVehicleType>
								control={control}
								name="status_id"
								render={({ field: { onChange, onBlur, value } }) => (
									<Fragment>
										<Pressable
											className="w-full h-12 border border-white/20  bg-white/15 rounded-lg justify-center px-4"
											onPress={() => setShowStatusPicker(true)}
										>
											<Text
												className={`text-sm ${
													!vehicle?.vehicle_statuses?.name
														? "text-white/50"
														: "text-white"
												}`}
											>
												{vehicleStatuses?.find(
													(status) => status.status_id === value,
												)?.name || "Statut"}
											</Text>
										</Pressable>

										<Modal
											visible={showStatusPicker}
											transparent={true}
											animationType="slide"
										>
											<View className="flex-1 justify-end bg-black/50">
												<View className="bg-zinc-900 w-full">
													<View className="flex-row justify-end p-4 border-b border-white/20">
														<Pressable
															onPress={() => setShowStatusPicker(false)}
														>
															<Text className="text-white font-bold">
																Valider
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
														{vehicleStatuses?.map((status) => (
															<Picker.Item
																key={status.status_id}
																label={status.name}
																value={status.status_id}
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

					<View className="w-full mt-10 mb-6">
						<Button
							disabled={!isFormValid}
							onPress={handleSubmit(onSubmit)}
							label="Continuer"
							variant="secondary"
							className="w-full"
						/>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};
