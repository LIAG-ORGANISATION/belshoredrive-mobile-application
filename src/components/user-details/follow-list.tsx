import { formatPicturesUri } from "@/lib/helpers/format-pictures-uri";
import { useUserFollowers, useUserFollowing } from "@/network/follows";
import { Ionicons } from "@expo/vector-icons";
import { type RelativePathString, router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { v4 as uuidv4 } from "uuid";

export const FollowList = ({
  userId,
  type,
}: {
  userId: string;
  type: "followers" | "following";
}) => {
  const navigation = useNavigation();
  const { previousScreen } = useLocalSearchParams();

  const { data: followers, isLoading: isLoadingFollowers } = useUserFollowers(userId);
  const { data: following, isLoading: isLoadingFollowing } = useUserFollowing(userId);

  const data = type === "followers" ? followers : following;
  const isLoading = type === "followers" ? isLoadingFollowers : isLoadingFollowing;

  useEffect(() => {
    navigation.setOptions({
      title: type === "followers" ? "Followers" : "Following",
      headerLeft: () => (
        <Pressable onPress={() => router.replace({ pathname: previousScreen as RelativePathString, params: { userId } })}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </Pressable>
      ),
    });
  }, [type, navigation, userId]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-black">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

	return (
		<View className="flex-1 bg-black text-white">
			{data?.map((item) => {
				return (
          <Pressable
            key={uuidv4()}
            className="flex-row items-center p-4 border-b border-gray-800"
            onPress={() => {
              router.push({
                pathname: "/(tabs)/profile",
                params: { userId: type === "followers" ? item.follower_id : item.followee_id },
              });
            }}
          >
            <View className="w-12 h-12 rounded-full bg-gray-800">
              {item.user_profiles.profile_picture_url && (
                <Image
                  source={{ uri: formatPicturesUri("profile_pictures", item.user_profiles.profile_picture_url) }}
                  className="w-12 h-12 rounded-full bg-gray-800"
                />
              )}
            </View>
            <View className="ml-4">
              <Text className="text-white font-semibold">
                {item.user_profiles.pseudo}
              </Text>
              <Text className="text-gray-400 text-sm">
                Followed {new Date(item.followed_at || "").toLocaleDateString()}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};
