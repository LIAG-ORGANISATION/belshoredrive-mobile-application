import { AddIcon } from "@/components/vectors/add-icon";
import { DirectMessageIcon } from "@/components/vectors/direct-message-icon";
import { IconCalendar } from "@/components/vectors/icon-calendar";
import { IconHome } from "@/components/vectors/icon-home";
import { NotificationIcon } from "@/components/vectors/notification-icon";
import { OptionsIcon } from "@/components/vectors/options-icon";
import { SearchIcon } from "@/components/vectors/search";
import { checkIfProfileComplete } from "@/lib/helpers/check-if-profile-complete";
import { useHasUnreadMessages } from "@/network/chat";
import { useFetchUserProfile } from "@/network/user-profile";
import { Link, Tabs } from "expo-router";
import type React from "react";
import { Image, Pressable, View } from "react-native";

export default function TabLayout() {
  const { data: profile, isLoading: loadingProfile } = useFetchUserProfile();
  const { data: hasUnreadMessages } = useHasUnreadMessages();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "#000",
        },
        headerTitleContainerStyle: {
          height: "auto",
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#757575",
        tabBarStyle: {
          backgroundColor: "#1F1F1F",
          borderTopWidth: 1,
          borderTopColor: "#2F2F2F",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Feed",
          sceneStyle: {
            backgroundColor: "#000",
          },
          headerTitleAlign: "left",
          headerTitleStyle: {
            color: "#fff",
            textAlign: "left",
            fontSize: 18,
            fontWeight: "800",
          },
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <View className="flex-1 items-center justify-center">
              <IconHome color={color} fill={color} />
            </View>
          ),
          headerRight: () => (
            <View className="flex-row items-center gap-2">
              <Link href="/onboarding" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <OptionsIcon
                      fill="#fff"
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>

              <Link href="/onboarding" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <NotificationIcon
                      fill="#fff"
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>

              <Link href="/(chats)" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <View className="relative">
                      <DirectMessageIcon
                        fill="#fff"
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                      {hasUnreadMessages && (
                        <View className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full" />
                      )}
                    </View>
                  )}
                </Pressable>
              </Link>
            </View>
          ),
        }}
        initialParams={{ isProfileComplete: checkIfProfileComplete(profile) }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          tabBarIcon: ({ color }) => (
            <View className="flex-1 items-center justify-center">
              <SearchIcon color={color} fill={color} />
            </View>
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: (props) => (
            <View className="relative w-16">
              <View className="absolute w-16 h-16 bottom-1/2 right-0 left-0 mx-auto bg-[#4AA8BA] rounded-full flex items-center justify-center">
                <AddIcon />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          tabBarIcon: ({ color }) => (
            <View className="flex-1 items-center justify-center">
              <IconCalendar color={color} fill={color} />
            </View>
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <View className="flex-1 items-center justify-center">
              <Image
                source={{ uri: profile?.profile_picture_url }}
                className={`w-6 h-6 rounded-full bg-cover ${
                  focused ? "border-2 border-white" : ""
                }`}
              />
            </View>
          ),
          tabBarShowLabel: false,
        }}
      />
    </Tabs>
  );
}
