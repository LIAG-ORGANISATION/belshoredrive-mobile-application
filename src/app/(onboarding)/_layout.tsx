import { ProgressBar } from "@/components/ui/progress-bar";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { View } from "react-native";

export default function OnboardingLayout() {
  return (
    <View className="flex-1 bg-black">
      <Stack screenOptions={{
        headerShown: false,
        headerTintColor: "white",
        headerStyle: { backgroundColor: "#000" },
      }}>
        <Stack.Screen
          name="index"
          options={{
            headerShown: true,
            headerTitle: () => <ProgressBar currentStep={0} totalSteps={5} />,
          }}
        />
        <Stack.Screen
          name="brands"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: "#000" },
            headerTitle: () => <ProgressBar currentStep={2} totalSteps={4} />,
            headerLeft: () => (
              <Ionicons
                name="chevron-back"
                size={24}
                color="white"
                onPress={() => router.back()}
              />
            ),
          }}
        />

        <Stack.Screen
          name="contacts"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: "#000" },
            headerTitle: () => <ProgressBar currentStep={3} totalSteps={4} />,
            headerLeft: () => (
              <Ionicons
                name="chevron-back"
                size={24}
                color="white"
                onPress={() => router.back()}
              />
            ),
          }}
        />

        <Stack.Screen
          name="interests"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: "#000" },
            headerTitle: () => <ProgressBar currentStep={4} totalSteps={4} />,
            headerLeft: () => (
              <Ionicons
                name="chevron-back"
                size={24}
                color="white"
                onPress={() => router.back()}
              />
            ),
          }}
        />
      </Stack>
    </View>
  );
}