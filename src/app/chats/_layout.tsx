import { useFetchUserProfile } from '@/network/user-profile';
import { Slot } from 'expo-router';
import { Text, View } from 'react-native';

export default function ChatsLayout() {
  const { data: profile, isLoading: loadingProfile } = useFetchUserProfile();

  if (loadingProfile) {
    return <Text>Loading...</Text>;
  }

  if (!profile) {
    return <Text>No profile found</Text>;
  }

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 py-safe-offset-6">
        <Slot />
      </View>
    </View>
  );
}