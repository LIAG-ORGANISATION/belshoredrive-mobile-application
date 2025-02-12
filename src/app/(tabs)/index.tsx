import { CompleteProfileCta } from "@/components/ui/complete-profile-cta";
import { useVehicles } from "@/network/vehicles";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, Image, Text, View } from "react-native";

export default function TabOneScreen() {
  const { isProfileComplete } = useLocalSearchParams();
  const { data: vehiclesPages, isLoading, error, fetchNextPage } = useVehicles();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Error: {error.message}</Text>
      </View>
    );
  }

  // Flatten the pages array into a single array of vehicles
  const vehicles = vehiclesPages?.pages.flat() ?? [];

  console.log(JSON.stringify(vehicles, null, 2));

  return (
    <View className="flex-1 items-center justify-start bg-black text-white mt-5">
      {isProfileComplete === "false" && <CompleteProfileCta />}

      <FlatList
        data={vehicles}
        className="w-full px-4"
        renderItem={({ item }) => (
          <View className="bg-gray-800 p-4 rounded-lg mb-4">
            {item.media && item.media.length > 0 && (
              <Image
                source={{ 
                  uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/vehicles/${item.media[0]}`
                }}
                className="w-full h-48 rounded-lg mb-4"
                resizeMode="cover"
              />
            )}
            <Text className="text-white text-lg font-bold">
              {item.brands?.name} {item.model}
            </Text>
            {item.nickname && (
              <Text className="text-gray-400">{item.nickname}</Text>
            )}
            <Text className="text-white mt-2">
              Year: {item.year}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.vehicle_id}
        onEndReached={() => fetchNextPage()}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}
