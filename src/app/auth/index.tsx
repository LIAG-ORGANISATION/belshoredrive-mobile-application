import { Platform, StatusBar, Text, View } from "react-native";

import { Button } from "@/components/ui/button";

import * as AppleAuthentication from 'expo-apple-authentication'

import { IconGoogle } from "@/components/vectors/icon-google";
import { IconPhone } from "@/components/vectors/icon-phone";
import { LogoB } from "@/components/vectors/logo-b";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Auth() {
	return (
		<View className="w-full flex-1 items-center justify-between h-screen px-safe-offset-6 bg-black">
			<StatusBar barStyle="light-content" />
			<View className="w-full h-full flex flex-col gap-6 justify-between">
				<View className="flex-col w-full gap-6 items-center">
					<LogoB className="mx-auto text-center" />
					<Text className="text-center text-white text-2xl font-bold">
						Créer un compte
					</Text>
				</View>

				{/* TODO : Display all BTN for each social media / */}
				<View className="flex-col w-full gap-4">
					<Button
						variant="with-icon"
						label="Avec un numéro de téléphone"
						icon={<IconPhone />}
						onPress={() => {
							router.push("/auth/phone");
						}}
					/>
					<Button
						variant="with-icon"
						label="Avec une adresse email"
						icon={<Ionicons name="mail-outline" size={24} color="white" />}
						onPress={() => {
							router.push("/auth/email");
						}}
					/>
					{Platform.OS === "ios" && (
						<AppleAuthentication.AppleAuthenticationButton
							buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
							buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
							cornerRadius={5}
							style={{ width: "100%", height: 44 }}
							onPress={async () => {
								try {
									const credential = await AppleAuthentication.signInAsync({
										requestedScopes: [
											AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
											AppleAuthentication.AppleAuthenticationScope.EMAIL,
										],
									})
									// Sign in via Supabase Auth.
									if (credential.identityToken) {
										const {
											error,
											data: { user },
										} = await supabase.auth.signInWithIdToken({
											provider: 'apple',
											token: credential.identityToken,
										})

										console.log(JSON.stringify({ error, user }, null, 2))

										if (!error) {
											router.push("/(onboarding)");
										}
									} else {
										throw new Error('No identityToken.')
									}
								} catch (e) {
									if (e instanceof Error && e.message === 'ERR_REQUEST_CANCELED') {
										// handle that the user canceled the sign-in flow
										alert("User canceled the sign-in flow");
									} else {
										// handle other errors
										alert("An error occurred");
									}
								}
							}}
						/>
					)}
					<Button
						variant="with-icon"
						label="Avec Google"
						icon={<IconGoogle />}
						onPress={() => {}}
					/>
				</View>

				<View className="flex-col w-full gap-4">
					<Text className="text-center text-white text-xs font-semibold uppercase">
						Déjà membre ?
					</Text>
					<Button
						variant="primary"
						label="Se connecter"
						onPress={() => {
							router.replace("/auth/login");
						}}
					/>
				</View>
				<View className="h-0" />
			</View>
		</View>
	);
}
