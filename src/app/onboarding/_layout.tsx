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
        name="index"
        options={{
          title: "Onboarding",
          headerShown: false,
          presentation: "fullScreenModal",
        }}
      />
    </Stack>
  );
}
