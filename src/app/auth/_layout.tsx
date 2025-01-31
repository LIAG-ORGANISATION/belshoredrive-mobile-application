import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
        presentation: "fullScreenModal",
      }}
    >
      <Stack.Screen
        name="auth"
        options={{
          title: "Créer un profile",
          headerShown: false,
          presentation: "fullScreenModal",
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: "Se connecter",
          headerShown: false,
          presentation: "fullScreenModal",
        }}
      />
    </Stack>
  );
}
