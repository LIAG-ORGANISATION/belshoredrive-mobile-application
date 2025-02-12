import { CompleteProfileCta } from "@/components/ui/complete-profile-cta";
import { useVehicles } from "@/network/vehicles";
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from "expo-router";
import { cssInterop } from 'nativewind';
import React from "react";
import { FlatList, Image, Text, View } from "react-native";

// Add this before the component
cssInterop(LinearGradient, {
  className: {
    target: 'style',
  },
});

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
        className="w-full mt-3"
        renderItem={({ item }) => (
          <View className="rounded-lg mb-4 relative h-96">
            {item.media && item.media.length > 0 && (
              <>
                <Image
                  source={{ 
                    uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/vehicles/${item.media[0]}`
                  }}
                  className="w-full h-full rounded-lg"
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  className="absolute bottom-0 w-full h-1/3 rounded-b-lg"
                />
              </>
            )}
            <View className="absolute bottom-4 left-4 right-4">
              {item.nickname && (
                <Text className="text-gray-200">{item.nickname}</Text>
              )}
              <Text className="text-white text-lg font-bold">
                {item.brands?.name} {item.model}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.vehicle_id}
        onEndReached={() => fetchNextPage()}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}
