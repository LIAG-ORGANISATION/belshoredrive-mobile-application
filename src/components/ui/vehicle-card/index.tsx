import { formatPicturesUri } from "@/lib/helpers/format-pictures-uri";
import type { VehicleWithComments } from "@/network/vehicles";
import type { Tables } from "@/types/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, View } from "react-native";

export const VehicleCard = ({
  item,
  user,
}: { item: VehicleWithComments; user?: Tables<"user_profiles"> }) => {
  return (
    <View key={item.vehicle_id} className="rounded-2xl mb-4 relative h-[500px]">
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
          <Text className="text-white font-semibold">{item.nickname}</Text>
        )}
        <Text className="text-white text-lg font-bold">
          {item.year} {item.brands?.name} {item.model}
        </Text>

        {/* Add owner information */}
        <View className="flex-row items-center mt-4">
          {(item.user_profiles?.profile_picture_url ||
            user?.profile_picture_url) && (
            <Image
              source={{
                uri: formatPicturesUri(
                  "profile_pictures",
                  item.user_profiles?.profile_picture_url ||
                    (user?.profile_picture_url as string),
                ),
              }}
              className="w-6 h-6 rounded-full mr-2"
            />
          )}
          <Text className="text-white text-sm">
            {item.user_profiles?.pseudo || user?.pseudo || "Unknown User"}
          </Text>
        </View>
      </View>
    </View>
  );
};
