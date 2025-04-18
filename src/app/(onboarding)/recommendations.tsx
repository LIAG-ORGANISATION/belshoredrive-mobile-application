import { Button } from "@/components/ui/button";
import { formatPicturesUri } from "@/lib/helpers/format-pictures-uri";
import { supabase } from "@/lib/supabase";
import { useFollowUser, useUnfollowUser } from "@/network/follows";
import { useGetSession } from "@/network/session";
import { useFetchUserProfile } from "@/network/user-profile";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";

type ProfileRecommendation = {
  user_id: string;
  pseudo: string;
  profile_picture_url: string | null;
  commonPoints: number;
  isFollowing: boolean;
  commonInterests?: string[];
};

const useProfileRecommendations = () => {
  const { data: session } = useGetSession();
  const { data: currentUserProfile } = useFetchUserProfile();
  const [recommendations, setRecommendations] = useState<ProfileRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!session || !currentUserProfile) return;

      try {
        // Get current user's data
        const currentUserInterests = currentUserProfile.interests || [];
        const currentUserBrands = currentUserProfile.favorite_vehicle_brands || [];
        const currentUserDepartments = currentUserProfile.viewable_departments || [];
        const currentUserServices = currentUserProfile.services || [];

        // Find users with shared interests, brands, departments or services
        const { data: potentialMatches, error } = await supabase
          .from("user_profiles")
          .select("*")
          .neq("user_id", session.user.id)
          .limit(20);

        if (error) throw error;

        // Get current user's follows to check if already following
        const { data: following, error: followingError } = await supabase
          .from("user_follows")
          .select("followee_id")
          .eq("follower_id", session.user.id);

        if (followingError) throw followingError;

        const followingIds = following.map(f => f.followee_id);

        // Calculate commonalities and sort
        const matchedProfiles = potentialMatches
          .map(profile => {
            let commonPoints = 0;
            const profileInterests = profile.interests || [];
            const profileBrands = profile.favorite_vehicle_brands || [];
            const profileDepartments = profile.viewable_departments || [];
            const profileServices = profile.services || [];

            // Count common items
            const commonInterests = profileInterests.filter((i: string) => currentUserInterests.includes(i));
            const commonBrands = profileBrands.filter((b: string) => currentUserBrands.includes(b));
            const commonDepartments = profileDepartments.filter((d: string) => currentUserDepartments.includes(d));
            const commonServices = profileServices.filter((s: string) => currentUserServices.includes(s));

            commonPoints = commonInterests.length + commonBrands.length +
                          commonDepartments.length + commonServices.length;

            return {
              user_id: profile.user_id,
              pseudo: profile.pseudo || 'Anonymous',
              profile_picture_url: profile.profile_picture_url,
              commonPoints,
              isFollowing: followingIds.includes(profile.user_id),
              commonInterests
            };
          })
          .filter(profile => profile.commonPoints > 0)
          .sort((a, b) => b.commonPoints - a.commonPoints)
          .slice(0, 7); // Get top matches

        setRecommendations(matchedProfiles);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [session, currentUserProfile]);

  return { recommendations, isLoading };
};

export default function RecommendationScreen() {
  const { recommendations, isLoading } = useProfileRecommendations();
  const { mutate: followUser } = useFollowUser();
  const { mutate: unfollowUser } = useUnfollowUser();

  const handleFollow = (userId: string, isFollowing: boolean) => {
    if (isFollowing) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
  };

  const handleContinue = () => {
    router.replace("/(tabs)");
  };

  const handleSkip = () => {
    router.replace("/(tabs)");
  };

  return (
    <View className="flex-1 bg-black">
      <ScrollView className="flex-1 px-4">
        <Text className="text-white text-2xl font-bold my-6">
          Suivez les profils qui vous ressemblent
        </Text>

        {isLoading ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color="#3CB4E5" />
          </View>
        ) : recommendations.length === 0 ? (
          <View className="items-center justify-center py-10">
            <Text className="text-white">Aucune recommandation disponible pour le moment</Text>
          </View>
        ) : (
          recommendations.map((profile) => (
            <View 
              key={profile.user_id}
              className="flex-row items-center justify-between py-4 border-b border-gray-800"
            >
              <View className="flex-row items-center flex-1">
                <View>
                  {profile.profile_picture_url ? (
                    <Image
                      source={{ uri: formatPicturesUri("profile_pictures", profile.profile_picture_url) }}
                      className="w-12 h-12 rounded-full mr-3"
                    />
                  ) : (
                    <View className="w-12 h-12 rounded-full bg-gray-700 items-center justify-center mr-3">
                      <Ionicons name="person" size={20} color="white" />
                    </View>
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-white font-medium">{profile.pseudo}</Text>
                  <Text className="text-gray-400 text-sm">
                    {profile.commonPoints} points communs
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => handleFollow(profile.user_id, profile.isFollowing)}
                className={`items-center justify-center p-2 rounded w-10 h-10
                  ${profile.isFollowing ? 'bg-teal-500' : 'bg-gray-700'}`}
              >
                {profile.isFollowing ? (
                  <Ionicons name="checkmark" size={20} color="white" />
                ) : (
                  <Ionicons name="close" size={20} color="white" />
                )}
              </Pressable>
            </View>
          ))
        )}

        <View className="h-20" />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-4 bg-black border-t border-gray-800">
        <Button
          variant="secondary"
          label="Continuer"
          onPress={handleContinue}
          className="mb-3"
        />
        <Pressable onPress={handleSkip}>
          <Text className="text-white text-center">Passer cette étape</Text>
        </Pressable>
      </View>
    </View>
  );
}
