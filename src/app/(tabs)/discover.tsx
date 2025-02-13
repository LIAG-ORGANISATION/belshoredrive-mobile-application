import { Input } from '@/components/ui/text-input';
import { formatPicturesUri } from '@/lib/helpers/format-pictures-uri';
import { supabase } from '@/lib/supabase';
import { useFetchBrands } from '@/network/brands';
import { useFetchDepartments } from '@/network/departments';
import { useVehicles } from "@/network/vehicles";
import type { Tables } from '@/types/supabase';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Filters = {
  brands: string[];
  departments: string[];
  types: string[];
};

export default function SearchScreen() {
  const [filters, setFilters] = useState<Filters>({
    brands: [],
    departments: [],
    types: [],
  });

  const { data: vehiclesPages, isLoading } = useVehicles();
  const { data: brands = [], isLoading: isLoadingBrands } = useFetchBrands();
  const { data: departments = [], isLoading: isLoadingDepartments } = useFetchDepartments();
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);


  const { data: searchResults, isLoading: isLoadingSearchResults } = useQuery({
    queryKey: ['userSearch', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];

      const { data, error } = await supabase
        .from('user_profiles')
        .select('user_id, pseudo, profile_picture_url')
        .ilike('pseudo', `%${searchQuery}%`)
        .limit(20);

      if (error) throw error;
      return data;
    },
    enabled: searchQuery.length > 0,
  });

  // Flatten and filter vehicles
  const vehicles = (vehiclesPages?.pages.flat() ?? []).filter(vehicle => {
    const matchesBrand = filters.brands.length === 0 || 
      (vehicle.brand_id && filters.brands.includes(vehicle.brand_id));

    // Add more filter conditions as needed
    return matchesBrand;
  });

  const renderVehicle = ({ item }: { item: Tables<'vehicles'> }) => (
    <TouchableOpacity 
      className="w-1/3 aspect-square p-1"
      onPress={() => {
        // Navigate to vehicle detail
      }}
    >
      <View className="w-full h-full overflow-hidden bg-gray-800">
        {item.media?.[0] ? (
          <Image
            source={{
              uri: formatPicturesUri('vehicles', item.media?.[0])
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <Text className="text-gray-400">No Image</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading || isLoadingBrands || isLoadingDepartments) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black p-safe-offset-2">
      <Input
        name="search"
        placeholder="Rechercher un utilisateur..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#757575"
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
        classes="w-full"
      />

      {isInputFocused && (
        <View className="absolute left-0 right-0 top-16 bottom-0 bg-black h-screen z-50" style={{ transform: [{ translateY: 70 }] }}>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.user_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-row items-center gap-3 py-3 px-4 border-b border-gray-800"
                onPress={() => {
                  console.log('Navigate to profile:', item.user_id);
                }}
              >
                <Image
                  source={{
                    uri: formatPicturesUri(
                      'profile_pictures',
                      item.profile_picture_url,
                    ),
                  }}
                  className="w-12 h-12 rounded-full bg-gray-700"
                />
                <Text className="text-white text-lg">{item.pseudo}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <View className="flex-1 items-center justify-center py-8">
                <Text className="text-gray-500">
                  {searchQuery.length > 0
                    ? 'Aucun utilisateur trouvé'
                    : 'Commencez à taper pour rechercher'}
                </Text>
              </View>
            )}
          />
        </View>
      )}

      <FlatList
        data={vehicles}
        renderItem={renderVehicle}
        keyExtractor={(item) => item.vehicle_id}
        numColumns={3}
        className="flex-1 mt-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
