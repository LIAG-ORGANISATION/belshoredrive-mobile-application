import { StatusBar, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { LogoB } from "@/components/vectors/logo-b";

export default function Auth() {
  return (
    <View className="w-full flex-1 items-center justify-between h-screen p-safe-offset-6 bg-black">
      <StatusBar translucent backgroundColor="transparent" />
      <View
        className="w-full flex flex-col gap-6"
      >
        <View className="flex-col w-full gap-6 items-center">
          <LogoB className="mx-auto text-center" />
          <Text className="text-center text-white text-2xl font-bold">
            Créer un compte
          </Text>
        </View>

        {/* TODO : Display all BTN for each social media / Provider */}

        <View className="flex-col w-full gap-4">
          <Text className="text-center text-white text-xs font-semibold uppercase">
            Vous avez déjà un compte ?
          </Text>
          <Button
            variant="secondary"
            label="Se connecter"
            onPress={() => {
              console.log("Se connecter");
            }}
          />
        </View>
      </View>
    </View>
  );
}
