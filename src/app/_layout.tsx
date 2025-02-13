import "@/global.css";
import StorybookUIRoot from "../../.storybook";
import "react-native-reanimated";
import { ProgressBar } from "@/components/ui/progress-bar";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, router, useLocalSearchParams, useNavigation } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AppState } from "react-native";
import { Text } from "react-native";

const isStoryBookEnabled = false;

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "/index",
};

const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    // TwemojiMozilla: require("../../assets/fonts/TwemojiMozilla.woff2"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const params = useLocalSearchParams();

  if (isStoryBookEnabled) {
    return <StorybookUIRoot />;
  }

  // Tells Supabase Auth to continuously refresh the session automatically
  // if the app is in the foreground. When this is added, you will continue
  // to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
  // `SIGNED_OUT` event if the user's session is terminated. This should
  // only be registered once.
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });

  // Add session check
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (session) {
        // User is signed in, redirect to main app
        router.replace("/(tabs)");
      } else {
        // No session, stay on auth flow
        router.push("/auth");
      }
    };

    checkSession();
  }, []);

  console.log(params);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{ headerShown: false, headerTitle: "" }}
          />
          <Stack.Screen
            name="auth/index"
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "#000" },
              headerTitle: "",
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
            name="auth/login"
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "#000" },
              headerTitle: "",
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
            name="auth/phone"
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "#000" },
              headerTitle: () => <ProgressBar currentStep={0} totalSteps={4} />,
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
            name="auth/email"
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "#000" },
              headerTitle: () => <ProgressBar currentStep={0} totalSteps={4} />,
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
            name="auth/verification"
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "#000" },
              headerTitle: () => <ProgressBar currentStep={1} totalSteps={4} />,
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
            name="onboarding/index"
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "#000" },
              headerTitle: () => <ProgressBar currentStep={1} totalSteps={4} />,
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
            name="onboarding/brands"
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
            name="onboarding/contact"
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
            name="onboarding/interests"
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
          <Stack.Screen
            name="complete-profile/index"
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "#000" },
              headerTitle: () => <ProgressBar currentStep={0} totalSteps={5} />,
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
            name="complete-profile/pick-avatar"
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "#000" },
              headerTitle: () => <ProgressBar currentStep={1} totalSteps={5} />,
              headerLeft: () => (
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color="white"
                  onPress={() => router.push("/(tabs)")}
                />
              ),
            }}
          />

          <Stack.Screen
            name="(chats)"
            options={{
              headerShown: false,
              headerTitle: "",
              headerStyle: { backgroundColor: "#000" },
            }}
          />

          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              headerStyle: { backgroundColor: "#000" },
            }}
          />

          <Stack.Screen
            name="(search)"
            options={{
              headerShown: false,
              headerStyle: { backgroundColor: "#000" },
              headerTitle: "",
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
      </ThemeProvider>
    </QueryClientProvider>
  );
}
