import { OptionsIcon } from '@/components/vectors/options-icon';
import { useFetchUserProfile } from '@/network/user-profile';
import { Ionicons } from '@expo/vector-icons';
import { Link, Stack, router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function ChatsLayout() {
  const { data: profile, isLoading: loadingProfile } = useFetchUserProfile();
  const params = useLocalSearchParams();

  if (loadingProfile) {
    return <Text>Loading...</Text>;
  }

  if (!profile) {
    return <Text>No profile found</Text>;
  }

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 py-safe-offset-6">
        <Stack screenOptions={{
          headerShown: false,
          headerTintColor: "white",
          headerTitle: "Conversations",
          headerStyle: { backgroundColor: "#000" },
        }}>
          <Stack.Screen
            name="index"
            options={{
              headerShown: true,
              headerTitle: "Conversations",
              headerStyle: { backgroundColor: "#000" },
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
            name="new-chat"
            options={{
              headerShown: true,
              headerTitle: "Nouveau message",
              headerStyle: { backgroundColor: "#000" },
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
            name="details/[chatId]"
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "#000" },
              headerTintColor: "white",
              headerTitle: ({ children }) => {
                return <Text className='text-white text-lg font-bold'>{params.title || children}</Text>;
              },
              headerLeft: () => (
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color="white"
                  onPress={() => router.back()}
                />
              ),
              headerRight: () => (
                <Link href="/(chats)/new-chat" asChild>
                  <Pressable>
                    {({ pressed }) => (
                      <OptionsIcon
                        fill="#fff"
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    )}
                  </Pressable>
              </Link>
              ),
            }}
          />
        </Stack>
      </View>
    </View>
  );
}