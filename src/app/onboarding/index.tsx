import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useFetchBrands } from "@/network/brands";
import type { Tables } from "@/types/supabase";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

export default function Onboarding() {
  const { data: brands = [], isLoading, error } = useFetchBrands();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<Tables<"user_profiles"> | null>(null);

  // Fetch user profile on mount
  useEffect(() => {
    async function fetchUserProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

        console.log("PROFILE --->", profile);

      if (profile) {
        setUserProfile(profile);
        setSelectedBrands(profile.favorite_vehicle_brands || []);
      }
    }
    fetchUserProfile();
  }, []);

  // Handle brand selection
  const toggleBrand = async (brandId: string) => {
    const newSelection = selectedBrands.includes(brandId)
      ? selectedBrands.filter(id => id !== brandId)
      : [...selectedBrands, brandId];

    setSelectedBrands(newSelection);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    console.log(newSelection);

    try {
      const res = await supabase
        .from("user_profiles")
        .update({ favorite_vehicle_brands: newSelection })
        .eq("user_id", user.id);

      console.log("RESPONSE --->", res);

      return res;
    } catch (error) {
      // Revert selection if update fails
      setSelectedBrands(selectedBrands);

      console.error('Failed to update favorite brands:', error);
    }
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1">
        <Text className="text-white text-2xl font-bold p-4">Quelles sont tes marques préférées ?</Text>

        <FlatList
          data={brands}
          numColumns={5}
          horizontal={false}
          contentContainerStyle={{ gap: 8, padding: 8, paddingBottom: 80 }}
          columnWrapperStyle={{ gap: 8 }}
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