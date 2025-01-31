import { useFetchBrands } from "@/network/brands";
import { FlatList, Text, View } from "react-native";

import { Button } from "@/components/ui/button";

export default function Onboarding() {
  const { data: brands = [], isLoading, error } = useFetchBrands();

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
            <Text key={brand.brand_id} className="text-white text-sm border border-white p-1 px-2 rounded-md bg-gray-900">
              {brand.name || "Unnamed brand"}
            </Text>
          )}
          keyExtractor={(brand) => brand.brand_id}
        />
      </View>

      <View className="absolute bottom-0 w-full px-4 pb-10 pt-4 bg-black z-10">
        <Button
          variant="secondary"
          label="Continuer" 
          disabled={false}
          onPress={() => {}}
        />
      </View>
    </View>
  );
}