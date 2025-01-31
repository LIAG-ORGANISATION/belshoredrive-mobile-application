import "@/global.css";
import StorybookUIRoot from "../../.storybook";
import "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
// import Constants from "expo-constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

const isStoryBookEnabled = false;

export {
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "/index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
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

  return (
    <RootLayoutNav />
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  if (isStoryBookEnabled) {
    return (
      <StorybookUIRoot />
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
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
              <Ionicons name="chevron-back" size={24} color="white" onPress={() => router.back()} />
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
              <Ionicons name="chevron-back" size={24} color="white" onPress={() => router.back()} />
            ),
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
