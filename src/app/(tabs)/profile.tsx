import { ExternalLink } from "@/components/ExternalLink";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { UserDetails } from "@/components/user-details";
import { Socials } from "@/components/user-details/socials";
import { EditIcon } from "@/components/vectors/edit-icon";
import { IdentificationIcon } from "@/components/vectors/identification-icon";
import { LinkIcon } from "@/components/vectors/link-icon";
import { QrCodeIcon } from "@/components/vectors/qr-code-icon";
import { ShareIcon } from "@/components/vectors/share-icon";
import { WheelIcon } from "@/components/vectors/wheel-icon";
import { formatPicturesUri } from "@/lib/helpers/format-pictures-uri";
import { supabase } from "@/lib/supabase";
import { useFetchUserProfile } from "@/network/user-profile";
import { useUserVehicles } from "@/network/vehicles";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

export default function TabOneScreen() {
  const { data: profile } = useFetchUserProfile();
  const { data: vehicles } = useUserVehicles(profile?.user_id as string);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // After successful logout, redirect to auth screen
      router.replace("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="w-full flex-1  bg-black text-white">
      {/* profile details */}
      <View className="w-full flex flex-col gap-2">
        <View className="flex flex-row gap-2">
          <View className="flex items-center justify-start">
            <Image
              source={{
                uri: formatPicturesUri(
                  "profile_pictures",
                  profile?.profile_picture_url as string,
                ),
              }}
              className={"w-24 h-24 rounded-full bg-cover"}
            />
          </View>
          <View className="flex flex-col gap-1 justify-center">
            <Text className="text-2xl text-white font-bold">
              {profile?.pseudo}
            </Text>
            <Text className="text-sm text-gray-400 text-ellipsis">
              {profile?.postal_address}
            </Text>
          </View>
        </View>
        <Text className="text-lg text-white font-semibold">
          {profile?.biography}
        </Text>
        <View className="flex flex-row gap-2">
          <ExternalLink
            href={`https://${profile?.website}`}
            className="text-sm text-gray-400"
          >
            <View className="flex flex-row gap-2 items-center">
              <LinkIcon />
              <Text className="text-sm font-semibold text-[#A1BDCA]">
                {profile?.website}
              </Text>
            </View>
          </ExternalLink>
        </View>

        <View className="w-full flex flex-row gap-2 my-2">
          <View className="flex-1 ">
            <Button
              variant="secondary"
              label="Modifier"
              onPress={handleLogout}
              className="gap-2"
              icon={<EditIcon />}
            />
          </View>
          <View className="flex-1">
            <Button
              variant="primary"
              label="Partager"
              onPress={handleLogout}
              className="gap-2"
              icon={<ShareIcon fill="#ffffff50" width={16} height={16} />}
            />
          </View>
          <View className="w-fit">
            <Button
              variant="primary"
              label=""
              onPress={handleLogout}
              icon={<QrCodeIcon />}
            />
          </View>
        </View>
        <View className="w-full flex flex-row gap-2">
          <View className="flex-1 items-center justify-center px-2 py-2 border border-gray-700 rounded-lg">
            <Text className="text-lg font-semibold text-white">
              105 suivi(e)s
            </Text>
          </View>
          <View className="flex-1 items-center justify-center px-2 py-2 border border-gray-700 rounded-lg">
            <Text className="text-lg font-semibold text-white">
              0 followers
            </Text>
          </View>
        </View>
      </View>
      <Tabs
        tabs={[
          {
            content: (
              <View className="flex items-center justify-center">
                {vehicles?.length === 0 && (
                  <Text className="text-white">Aucun véhicule trouvé</Text>
                )}
                {vehicles?.map((item) => (
                  <View
                    key={item.vehicle_id}
                    className="rounded-2xl mb-4 relative h-[500px]"
                  >
                    {item.media && item.media.length > 0 && (
                      <>
                        <Image
                          source={{
                            uri: formatPicturesUri("vehicles", item.media[0]),
                          }}
                          className="w-full h-full rounded-2xl"
                          resizeMode="cover"
                        />
                        <LinearGradient
                          colors={["transparent", "rgba(0,0,0,0.8)"]}
                          className="absolute bottom-0 w-full h-1/3 rounded-b-lg"
                        />
                      </>
                    )}
                    <View className="absolute bottom-4 left-4 right-4">
                      {item.nickname && (
                        <Text className="text-white font-semibold">
                          {item.nickname}
                        </Text>
                      )}
                      <Text className="text-white text-lg font-bold">
                        {item.year} {item.brands?.name} {item.model}
                      </Text>

                      {/* Add owner information */}
                      <View className="flex-row items-center mt-4">
                        {item.user_profiles?.profile_picture_url && (
                          <Image
                            source={{
                              uri: formatPicturesUri(
                                "profile_pictures",
                                item.user_profiles.profile_picture_url,
                              ),
                            }}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                        )}
                        <Text className="text-white text-sm">
                          {item.user_profiles?.pseudo || "Unknown User"}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ),
            icon: <WheelIcon />,
          },
          {
            content: <UserDetails userId={profile?.user_id as string} />,
            icon: <IdentificationIcon />,
          },
          {
            content: <Socials user={profile} />,
            icon: <LinkIcon width={24} height={24} />,
          },
        ]}
      />
      {/* <Button variant="primary" label="Logout" onPress={handleLogout} /> */}
    </ScrollView>
  );
}
