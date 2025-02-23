import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/text-input";
import { type PhoneLoginType, phoneLoginSchema } from "@/lib/schemas/auth";
import { supabase } from "@/lib/supabase";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { router } from "expo-router";
import phone from "phone";
import { useState } from "react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import PhoneInput, {
	type ICountry,
} from "react-native-international-phone-number";

export default function Phone() {
	const [selectedCountry, setSelectedCountry] = useState<ICountry>();
	const [fullNumber, setFullNumber] = useState<string>("");
	const [isValid, setIsValid] = useState<boolean>(false);
	const [codeSent, setCodeSent] = useState<boolean>(false);
	const [code, setCode] = useState<string>("");
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
		watch,
	} = useForm<PhoneLoginType>({
		resolver: valibotResolver(phoneLoginSchema),
		criteriaMode: "all",
		defaultValues: {
			countryCode: "+33",
			phoneNumber: "",
		},
		mode: "onChange",
	});

	const phoneNumber = watch("phoneNumber");
	const countryCode = watch("countryCode");

	useEffect(() => {
		const result = phone(`${countryCode}${phoneNumber}`);

		if (result.isValid) {
			setIsValid(true);
			setFullNumber(result.phoneNumber);
		} else {
			setIsValid(false);
		}
	}, [countryCode, phoneNumber]);

	const handleVerification = async (values: PhoneLoginType) => {
		const check = phone(fullNumber);

		if (!check.isValid) {
			return;
		}

		const { data, error } = await supabase.auth.signInWithOtp({
			phone: check.phoneNumber,
		});

		if (error) {
			console.error(error);
		}

		setCodeSent(true);
	};

	const handleVerificationCode = async () => {
		const { data, error } = await supabase.auth.verifyOtp({
			phone: fullNumber,
			token: code,
			type: "sms",
		});

		if (error) {
			console.error(error);
		}

		router.push("/(tabs)");
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			className="flex-1"
		>
			<View className="w-full flex-1 items-center justify-between h-screen  pt-safe-offset-4 pb-safe-offset-20 px-safe-offset-6 bg-black">
				<View className="w-full flex-1 gap-2">
					<Text className="text-white text-2xl font-bold">
						Quel est votre numéro de téléphone ?
					</Text>

					<Text className="text-white/70 text-sm">
						Uniquement utilisé pour confirmer votre identité. Ce numéro restera
						confidentiel, ne sera ni vendu, ni utilisé pour de la publicité.
					</Text>

					<View className="flex-col w-full gap-4 mt-6">
						<Controller
							control={control}
							name="phoneNumber"
							render={({ field: { value, onChange, onBlur } }) => (
								<PhoneInput
									defaultCountry="FR"
									value={value}
									onBlur={onBlur}
									onChangePhoneNumber={(v) => setValue("phoneNumber", v)}
									selectedCountry={selectedCountry}
									onChangeSelectedCountry={(country) => {
										setSelectedCountry(country);
										setValue("countryCode", country.callingCode);
									}}
									customCaret={
										<Ionicons
											name="chevron-down"
											size={16}
											color="white"
											onPress={() => router.back()}
										/>
									}
									phoneInputStyles={{
										container: {
											backgroundColor: "#1F1F1F",
											borderColor: "#545454",
										},
										flagContainer: {
											backgroundColor: "#1F1F1F",
										},
										caret: {},
										input: {
											backgroundColor: "#1F1F1F",
											color: "#FFFFFF",
										},
										divider: {
											backgroundColor: "#545454",
										},
										callingCode: {
											color: "#FFFFFF",
										},
									}}
									modalStyles={{
										modal: {
											backgroundColor: "#1F1F1F",
										},
										divider: {
											backgroundColor: "#545454",
										},
										countriesList: {
											backgroundColor: "#1F1F1F",
										},
										searchInput: {
											backgroundColor: "#1F1F1F",
											color: "#FFFFFF",
										},
										countryButton: {
											backgroundColor: "#1F1F1F",
										},
										noCountryText: {
											backgroundColor: "#1F1F1F",
										},
										noCountryContainer: {
											backgroundColor: "#1F1F1F",
										},
										flag: {
											backgroundColor: "#1F1F1F",
										},
										callingCode: {
											color: "#FFFFFF",
										},
										countryName: {
											backgroundColor: "#1F1F1F",
											color: "#FFFFFF",
										},
									}}
								/>
							)}
						/>
						<Text className="text-red-500 text-sm">
							{errors.countryCode?.message || errors.phoneNumber?.message}
						</Text>

						<Button
							variant="secondary"
							label="Continuer"
							disabled={!isValid || isSubmitting || codeSent}
							onPress={handleSubmit(handleVerification)}
						/>
					</View>

					{codeSent && (
						<View className="w-full">
							<Text className="text-white text-sm">
								Un code de vérification a été envoyé à votre numéro de
								téléphone.
							</Text>

							<Input
								name="code"
								placeholder="Code de vérification"
								className="mt-4"
								keyboardType="numeric"
								secureTextEntry
								value={code}
								onChangeText={setCode}
							/>
						</View>
					)}
				</View>
				{codeSent && (
					<View className="w-full">
						<Button
							variant="secondary"
							label="Continuer"
							disabled={!isValid || isSubmitting}
							onPress={handleVerificationCode}
						/>
					</View>
				)}
			</View>
		</KeyboardAvoidingView>
	);
}
