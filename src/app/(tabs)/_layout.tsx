import { AddIcon } from "@/components/vectors/add-icon";
import { DirectMessageIcon } from "@/components/vectors/direct-message-icon";
import { IconCalendar } from "@/components/vectors/icon-calendar";
import { IconHome } from "@/components/vectors/icon-home";
import { NotificationIcon } from "@/components/vectors/notification-icon";
import { OptionsIcon } from "@/components/vectors/options-icon";
import { SearchIcon } from "@/components/vectors/search";
import { checkIfProfileComplete } from "@/lib/helpers/check-if-profile-complete";
import { formatPicturesUri } from "@/lib/helpers/format-pictures-uri";
import { useHasUnreadMessages } from "@/network/chat";
import { useFetchUserProfile } from "@/network/user-profile";
import { Ionicons } from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

export default function TabLayout() {
  const { data: hasUnreadMessages } = useHasUnreadMessages();
  const { data: profile, isLoading: loadingProfile } = useFetchUserProfile();

  if (loadingProfile) {
    return <Text>Loading...</Text>;
  }

  if (!profile) {
    return <Text>No profile found</Text>;
  }

  return (
    <View className="flex-1 w-full">
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
                          style={{
                            marginRight: 15,
                            opacity: pressed ? 0.5 : 1,
                          }}
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
          initialParams={{
            isProfileComplete: checkIfProfileComplete(profile),
          }}
        />
        <Tabs.Screen
          name="discover"
          options={{
            headerShown: false,
            headerStyle: { backgroundColor: "#000" },
            headerTitle: "",
            tabBarIcon: ({ color }) => (
              <View className="flex-1 items-center justify-center">
                <Link href="/(tabs)/discover" asChild>
                  <Pressable>
                    <SearchIcon color={color} fill={color} />
                  </Pressable>
                </Link>
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
                <Link href="/(tabs)/calendar" asChild>
                  <Pressable>
                    <IconCalendar color={color} fill={color} />
                  </Pressable>
                </Link>
              </View>
            ),
            tabBarShowLabel: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: true,
            title: profile.pseudo || "",
            sceneStyle: {
              backgroundColor: "#000",
            },
            headerTitleAlign: "center",
            headerTitleStyle: {
              color: "#fff",
              textAlign: "auto",
              fontSize: 18,
              fontWeight: "800",
            },
            tabBarShowLabel: false,
            headerRight: () => (
              <View className="flex-row items-center gap-2 rotate-90">
                <Link href="/onboarding" asChild>
                  <Pressable>
                    <OptionsIcon fill="#fff" />
                  </Pressable>
                </Link>
              </View>
            ),
            tabBarIcon: ({ color, focused }) => (
              <View className="flex-1 items-center justify-center">
                {profile?.profile_picture_url ? (
                  <Image
                  source={{
                    uri: formatPicturesUri(
                      "profile_pictures",
                      profile?.profile_picture_url as string,
                    ),
                  }}
                  className={`w-6 h-6 rounded-full bg-slate-500 bg-cover ${
                    focused ? "border-2 border-white" : ""
                    }`}
                  />
                ) : (
                  <View className="w-6 h-6 flex items-center justify-center">
                    <Text className="text-white text-sm font-semibold">
                      <Ionicons name="person" size={20} color={color} />
                    </Text>
                  </View>
                )}
              </View>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
