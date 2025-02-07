import { StatusBar, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { IconApple } from "@/components/vectors/icon-apple";
import { IconGoogle } from "@/components/vectors/icon-google";
import { IconPhone } from "@/components/vectors/icon-phone";
import { LogoB } from "@/components/vectors/logo-b";
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
          <Button
            variant="with-icon"
            label="Avec Google"
            icon={<IconGoogle />}
            onPress={() => {}}
          />
          <Button
            variant="with-icon"
            label="Avec Apple"
            icon={<IconApple />}
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
