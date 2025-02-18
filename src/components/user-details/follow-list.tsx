import { formatPicturesUri } from "@/lib/helpers/format-pictures-uri";
import { useUserFollowers, useUserFollowing } from "@/network/follows";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { v4 as uuidv4 } from "uuid";

export const FollowList = ({
  userId,
  type,
}: {
  userId: string;
  type: "followers" | "following";
}) => {
  const { data: followers } = useUserFollowers(userId);
  const { data: following } = useUserFollowing(userId);

  const data = type === "followers" ? followers : following;

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
