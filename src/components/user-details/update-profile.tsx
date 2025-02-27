import { Input } from "@/components/ui/text-input";
import { FacebookIcon } from "@/components/vectors/facebookIcon";
import { IconX } from "@/components/vectors/icon-x";
import { InstagramIcon } from "@/components/vectors/instagram-icon";
import { TikTokIcon } from "@/components/vectors/tiktok-icon";
import {
	type CompleteProfileType,
	completeProfileDetailsSchema,
} from "@/lib/schemas/complete-profile";
import {
	useFetchUserProfile,
	useUpdateUserProfile,
} from "@/network/user-profile";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Picker } from "@react-native-picker/picker";
import { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native";

import { Button } from "@/components/ui/button";

export const UpdateProfile = ({
	onSuccess,
	title,
}: { onSuccess: () => void; title?: string }) => {
	const { data: userProfile } = useFetchUserProfile();
	const { mutate: updateProfile } = useUpdateUserProfile();

	const {
		control,
		handleSubmit,
		formState: { errors, isValid, isSubmitting },
		reset,
	} = useForm<CompleteProfileType>({
		resolver: valibotResolver(completeProfileDetailsSchema),
		defaultValues: {
			biography: "",
			birth_year: 0,
			postal_address: "",
			website_url: "",
			instagram: "",
			facebook: "",
			twitter: "",
			tiktok: "",
		},
		mode: "onBlur",
		criteriaMode: "all",
	});

	useEffect(() => {
		if (userProfile) {
			reset({
				biography: userProfile.biography || "",
				birth_year: userProfile.birth_year || 0,
				postal_address: userProfile.postal_address || "",
				website_url: userProfile.website || "",
				instagram: userProfile.instagram || "",
				facebook: userProfile.facebook || "",
				twitter: userProfile.twitter || "",
				tiktok: userProfile.tiktok || "",
			});
		}
	}, [userProfile]);

	const [showPicker, setShowPicker] = useState(false);

	const onSubmit = async (data: CompleteProfileType) => {
		try {
			await updateProfile({
				biography: data.biography,
				birth_year: data.birth_year,
				postal_address: data.postal_address,
				website: data.website_url,
				instagram: data.instagram,
				facebook: data.facebook,
				twitter: data.twitter,
				tiktok: data.tiktok,
			});
			onSuccess();
		} catch (error) {
			console.error("Failed to update profile:", error);
		}
	};

	return (
		<KeyboardAvoidingView 
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			className="flex-1"
			keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
		>
			<View
				className={
					"w-full h-fit max-h-screen flex-1 items-start justify-between pb-safe-offset-4 bg-black px-3"
				}
			>
				<View className="w-full flex-col items-start justify-between gap-4">
					{title && (
						<Text className="text-white text-2xl font-bold">{title}</Text>
					)}
				</View>

				<ScrollView
					className="w-full flex-1 flex-col gap-4"
					contentContainerStyle={{ gap: 16 }}
				>
					<View className="flex-col w-full gap-1 ">
						<Text className="text-white text-lg font-semibold my-4">
							INFORMARTIONS DU PROFIL
						</Text>
						<Text className="text-white text-base font-semibold">Biographie</Text>
						<Controller<CompleteProfileType>
							control={control}
							name="biography"
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									placeholder="Biographie (Obligatoire)"
									classes="h-24"
									name="biography"
									value={value as string}
									onChangeText={onChange}
									onBlur={onBlur}
									multiline={true}
									numberOfLines={4}
									placeholderTextColor="white"
									error={errors.biography}
								/>
							)}
						/>
					</View>
					<View className="flex-col w-full gap-1 ">
						<Text className="text-white text-base font-semibold">
							Année de naissance
						</Text>
						<Controller<CompleteProfileType>
							control={control}
							name="birth_year"
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
											{value ? String(value) : "Année de naissance (Obligatoire)"}
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
					<View className="flex-col w-full gap-1 ">
						<Text className="text-white text-base font-semibold">
							Adresse postale
						</Text>
						<Controller<CompleteProfileType>
							control={control}
							name="postal_address"
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									placeholder="Ville de résidence"
									name="postal_address"
									value={value as string}
									onChangeText={onChange}
									onBlur={onBlur}
									placeholderTextColor="white"
									error={errors.postal_address}
								/>
							)}
						/>
					</View>
					<View className="flex-col w-full gap-1 ">
						<Text className="text-white text-base font-semibold">Site web</Text>
						<Controller<CompleteProfileType>
							control={control}
							name="website_url"
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									placeholder="Site web"
									name="website_url"
									value={value as string}
									onChangeText={onChange}
									onBlur={onBlur}
									placeholderTextColor="white"
									error={errors.website_url}
								/>
							)}
						/>
					</View>

					<View className="flex-col w-full gap-1 ">
						<Text className="text-white text-lg font-semibold my-4">
							RÉSEAUX SOCIAUX
						</Text>
						<View className="flex-col w-full gap-1 ">
							<Text className="text-white text-base font-semibold">
								Instagram
							</Text>
							<Controller<CompleteProfileType>
								control={control}
								name="instagram"
								render={({ field: { onChange, onBlur, value } }) => (
									<Input
										placeholder="instagram.com/"
										name="instagram"
										value={value as string}
										onChangeText={onChange}
										onBlur={onBlur}
										placeholderTextColor="white"
										error={errors.instagram}
										icon={
											<View className="mt-2">
												<InstagramIcon />
											</View>
										}
									/>
								)}
							/>
						</View>
					</View>
					<View className="flex-col w-full gap-1 ">
						<Text className="text-white text-base font-semibold">Facebook</Text>
						<Controller<CompleteProfileType>
							control={control}
							name="facebook"
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									placeholder="facebook.com/"
									name="facebook"
									value={value as string}
									onChangeText={onChange}
									onBlur={onBlur}
									placeholderTextColor="white"
									error={errors.facebook}
									icon={
										<View className="mt-2">
											<FacebookIcon />
										</View>
									}
								/>
							)}
						/>
					</View>
					<View className="flex-col w-full gap-1 ">
						<Text className="text-white text-base font-semibold">X</Text>
						<Controller<CompleteProfileType>
							control={control}
							name="twitter"
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									placeholder="x.com/"
									name="twitter"
									value={value as string}
									onChangeText={onChange}
									onBlur={onBlur}
									placeholderTextColor="white"
									error={errors.twitter}
									icon={
										<View className="mt-2 opacity-50">
											<IconX />
										</View>
									}
								/>
							)}
						/>
					</View>

					<View className="flex-col w-full gap-1 ">
						<Text className="text-white text-base font-semibold">TikTok</Text>
						<Controller<CompleteProfileType>
							control={control}
							name="tiktok"
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									placeholder="tiktok.com/"
									name="tiktok"
									value={value as string}
									onChangeText={onChange}
									onBlur={onBlur}
									placeholderTextColor="white"
									error={errors.tiktok}
									icon={
										<View className="mt-2">
											<TikTokIcon />
										</View>
									}
								/>
							)}
						/>
					</View>
				</ScrollView>
				<View className="bottom-0 w-full pt-4 bg-black z-10 inset-x-0">
					<Button
						variant="secondary"
						label="Continuer"
						disabled={!isValid || isSubmitting}
						onPress={handleSubmit(onSubmit)}
					/>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
};
