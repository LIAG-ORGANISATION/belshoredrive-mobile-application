import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/text-input";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";

export default function Verification() {
	const router = useRouter();
	const [code, setCode] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { phone } = useLocalSearchParams<{ phone: string }>();

	const handleVerificationCode = async () => {
		try {
			setLoading(true);
			setError(null);

			const { error: verificationError } = await supabase.auth.verifyOtp({
				phone: phone,
				token: code,
				type: "sms",
			});

			if (verificationError) {
				setError("Code de vérification invalide. Veuillez réessayer.");
				return;
			}

			router.push("/(tabs)");
		} catch (e) {
			setError("Une erreur est survenue. Veuillez réessayer.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView 
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			className="flex-1 bg-black"
		>
			<ScrollView 
				contentContainerClassName="flex-grow"
				keyboardShouldPersistTaps="handled"
			>
				<View className="flex-1 px-4 justify-center">
					<Text className="text-white text-xl font-semibold mb-2 text-center">
						Vérification
					</Text>
					<Text className="text-white text-sm text-center mb-6">
						Un code de vérification a été envoyé à votre numéro de
						téléphone {phone}.
					</Text>

					<Input
						name="code"
						placeholder="Code de vérification"
						className="mt-4"
						keyboardType="numeric"
						value={code}
						onChangeText={setCode}
						maxLength={6}
						editable={!loading}
					/>

					{error && (
						<Text className="text-red-500 mt-2 text-sm">
							{error}
						</Text>
					)}
					<View className="w-full mt-6">
						<Button
							variant="secondary"
							label="Continuer"
							disabled={code.length !== 6 || loading}
							onPress={handleVerificationCode}
						/>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
