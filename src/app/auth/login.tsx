import { StatusBar, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { IconApple } from "@/components/vectors/icon-apple";
import { IconFacebook } from "@/components/vectors/icon-facebook";
import { IconGoogle } from "@/components/vectors/icon-google";
import { IconPhone } from "@/components/vectors/icon-phone";
import { IconX } from "@/components/vectors/icon-x";
import { LogoB } from "@/components/vectors/logo-b";
import { router } from "expo-router";

export default function Login() {
  return (
    <View className="w-full flex-1 items-center justify-between h-screen p-safe-offset-6 bg-black">
      <View
        className="w-full flex flex-col gap-6"
      >
        <View className="flex-col w-full gap-6 items-center">
          <LogoB className="mx-auto text-center" />
          <Text className="text-center text-white text-2xl font-bold">
            Se connecter
          </Text>
        </View>

        {/* TODO : Display all BTN for each social media / */}
        <View className="flex-col w-full gap-4">
          <Button
            variant="primary"
            label="Avec un numéro de téléphone"
            textPosition="left"
            icon={<IconPhone />}
            onPress={() => {}}
          />
          <Button
            variant="primary"
            label="Avec Google"
            textPosition="left"
            icon={<IconGoogle />}
            onPress={() => {}}
          />
          <Button
            variant="primary"
            label="Avec Apple"
            textPosition="left"
            icon={<IconApple />}
            onPress={() => {}}
          />
          <Button
            variant="primary"
            label="Avec Facebook"
            textPosition="left"
            icon={<IconFacebook />}
            onPress={() => {}}
          />
          <Button
            variant="primary"
            label="Avec X"
            textPosition="left"
            icon={<IconX />}
            onPress={() => {}}
          />
        </View>

        <View className="flex-col w-full gap-4">
          <Text className="text-center text-white text-xs font-semibold uppercase">
            Pas encore membre ?
          </Text>
          <Button
            variant="primary"
            label="S'inscrire"
            onPress={() => {
              router.push("/auth");
            }}
          />
        </View>
      </View>
    </View>
  );
}
