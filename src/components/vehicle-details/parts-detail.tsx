import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/text-input";
import {
	type PartsDetailsType,
	partsDetailsSchema,
} from "@/lib/schemas/create-vehicle";
import { useFetchVehicleById, useUpdateVehicle } from "@/network/vehicles";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Link } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { ScrollView } from "react-native";

export const PartsDetails = ({
	onSuccess,
	vehicleId,
}: { onSuccess: () => void; vehicleId: string }) => {
	const { data: vehicle } = useFetchVehicleById(vehicleId);
	const { mutate: updateVehicle } = useUpdateVehicle();

	const {
		control,
		handleSubmit,
		formState: { errors, isValid, isSubmitting },
		reset,
	} = useForm<PartsDetailsType>({
		resolver: valibotResolver(partsDetailsSchema),
		defaultValues: {
			motorization: "",
			chassis: "",
			braking: "",
			exterior: "",
			technical_document: "",
		},
		mode: "onBlur",
		criteriaMode: "all",
	});

	useEffect(() => {
		if (vehicle) {
			reset({
				motorization: vehicle.motorization || "",
				chassis: vehicle.chassis || "",
				braking: vehicle.braking || "",
				exterior: vehicle.exterior || "",
				technical_document: vehicle.technical_document || "",
			});
		}
	}, [vehicle]);

	const onSubmit = async (data: PartsDetailsType) => {
		try {
			await updateVehicle(
				{
					vehicleId,
					updates: {
						motorization: data.motorization,
						chassis: data.chassis,
						braking: data.braking,
						exterior: data.exterior,
						// technical_document: data.technical_document,
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

	if (!vehicle) {
		return <Text className="text-white text-lg">Chargement...</Text>;
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			className="flex-1 bg-black"
			keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
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
							Motorisation
						</Text>
						<View className="flex-1">
							<Controller<PartsDetailsType>
								control={control}
								name="motorization"
								render={({ field: { onChange, onBlur, value } }) => (
									<Input
										placeholder="Motorisation"
										name="motorization"
										value={value as string}
										onChangeText={(value) => onChange(value)}
										onBlur={onBlur}
										classes="h-32"
										placeholderTextColor="white"
										multiline={true}
										numberOfLines={4}
										error={errors.motorization}
									/>
								)}
							/>
						</View>
					</View>
					<View className="flex-col w-full gap-1 ">
						<Text className="text-white text-base font-semibold">Chassis</Text>
						<View className="flex-1">
							<Controller<PartsDetailsType>
								control={control}
								name="chassis"
								render={({ field: { onChange, onBlur, value } }) => (
									<Input
										placeholder="Chassis"
										name="chassis"
										value={value as string}
										onChangeText={(value) => onChange(value)}
										onBlur={onBlur}
										classes="h-32"
										placeholderTextColor="white"
										error={errors.chassis}
										multiline={true}
										numberOfLines={4}
									/>
								)}
							/>
						</View>
					</View>
					<View className="flex-col w-full gap-1 ">
						<Text className="text-white text-base font-semibold">Freinage</Text>
						<View className="flex-1">
							<Controller<PartsDetailsType>
								control={control}
								name="braking"
								render={({ field: { onChange, onBlur, value } }) => (
									<Input
										placeholder="Freinage"
										name="braking"
										value={value as string}
										onChangeText={(value) => onChange(value)}
										onBlur={onBlur}
										classes="h-32"
										placeholderTextColor="white"
										error={errors.braking}
										multiline={true}
										numberOfLines={4}
									/>
								)}
							/>
						</View>
					</View>
					<View className="flex-col w-full gap-1 ">
						<Text className="text-white text-base font-semibold">Exterior</Text>
						<View className="flex-1">
							<Controller<PartsDetailsType>
								control={control}
								name="exterior"
								render={({ field: { onChange, onBlur, value } }) => (
									<Input
										placeholder="Exterior"
										name="exterior"
										value={value as string}
										onChangeText={(value) => onChange(value)}
										onBlur={onBlur}
										classes="h-32"
										placeholderTextColor="white"
										error={errors.exterior}
										multiline={true}
										numberOfLines={4}
									/>
								)}
							/>
						</View>
						<View className="flex-col w-full gap-1 ">
							<Text className="text-white text-base font-semibold">
								Document technique
							</Text>
							<View className="flex-1">
								<Controller<PartsDetailsType>
									control={control}
									name="technical_document"
									render={({ field: { onChange, onBlur, value } }) => (
										<Input
											placeholder="Document technique"
											name="technical_document"
											value={value as string}
											onChangeText={(value) => onChange(value)}
											onBlur={onBlur}
											classes="h-32"
											placeholderTextColor="white"
											error={errors.technical_document}
											multiline={true}
											numberOfLines={4}
										/>
									)}
								/>
							</View>
						</View>
					</View>
				</ScrollView>

				<View className="w-full flex-col gap-4">
					<View className="w-full">
						<Button
							className="w-full"
							variant="secondary"
							label="Continuer"
							onPress={handleSubmit(onSubmit)}
						/>
					</View>
					<Link href="/(tabs)" asChild>
						<Text className="text-white text-sm text-center font-semibold">
							Passer cette étape
						</Text>
					</Link>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
};
