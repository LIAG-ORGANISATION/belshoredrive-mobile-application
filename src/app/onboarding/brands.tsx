import { Button } from "@/components/ui/button";
import { useFetchBrands } from "@/network/brands";
import { useFetchUserProfile, useUpdateUserProfile } from "@/network/user-profile";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

export default function Onboarding() {
  const { data: brands = [], isLoading: loadingBrands, error: brandsError } = useFetchBrands();
  const { data: profile, isLoading: loadingProfile } = useFetchUserProfile();
  const { mutate: updateProfile } = useUpdateUserProfile();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Initialize selected brands from profile
  useEffect(() => {
    if (profile?.favorite_vehicle_brands) {
      setSelectedBrands(profile.favorite_vehicle_brands);
    }
  }, [profile]);

  // Handle brand selection
  const toggleBrand = async (brandId: string) => {
    const newSelection = selectedBrands.includes(brandId)
      ? selectedBrands.filter(id => id !== brandId)
      : [...selectedBrands, brandId];

    setSelectedBrands(newSelection);

    try {
      await updateProfile({ favorite_vehicle_brands: newSelection });
    } catch (error) {
      // Revert selection if update fails
      setSelectedBrands(selectedBrands);
      console.error('Failed to update favorite brands:', error);
    }
  };

  if (loadingBrands || loadingProfile) return <Text>Loading...</Text>;
  if (brandsError) return <Text>Error: {brandsError.message}</Text>;

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1">
        <Text className="text-white text-2xl font-bold p-4">Quelles sont tes marques préférées ?</Text>

        <FlatList
          data={brands}
          columnWrapperClassName="flex flex-wrap gap-2 mb-2"
          numColumns={4}
          renderItem={({ item: brand }) => (
            <Pressable
              key={brand.brand_id}
              onPress={() => toggleBrand(brand.brand_id)}
            >
              <Text 
                className={`text-sm border border-white p-1 px-2 rounded-md ${
                  selectedBrands.includes(brand.brand_id) 
                    ? "bg-white text-black" 
                    : "bg-gray-900 text-white"
                }`}
              >
                {brand.name || "Unnamed brand"}
              </Text>
            </Pressable>
          )}
          keyExtractor={(brand) => brand.brand_id}
        />
      </View>

      <View className="absolute bottom-0 w-full px-4 pb-10 pt-4 bg-black z-10">
        <Button
          variant="secondary"
          label="Continuer" 
          disabled={selectedBrands.length === 0}
          onPress={() => {}}
        />
      </View>
    </View>
  );
}