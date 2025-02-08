import { useEffect } from "react";
import { Text, View } from "react-native";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";

import { ChipSelector } from "@/components/chip-selector";
import { Button } from "@/components/ui/button";
import type { ExtractId } from "@/lib/helpers/extract-id";
import { mapToId } from "@/lib/helpers/map-to-id";
import {
  type FavoriteBrandsType,
  favoriteBrands,
} from "@/lib/schemas/onboarding";
import { type BrandsType, useFetchBrands } from "@/network/brands";
import {
  useFetchUserProfile,
  useUpdateUserProfile,
} from "@/network/user-profile";

export default function Onboarding() {
  const {
    data: brands = [],
    isLoading: loadingBrands,
    error: brandsError,
  } = useFetchBrands();
  const { data: profile, isLoading: loadingProfile } = useFetchUserProfile();
  const { mutate: updateProfile } = useUpdateUserProfile();

  const {
    control,
    reset,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<FavoriteBrandsType>({
    resolver: valibotResolver(favoriteBrands),
  });

  const onSubmit = async (data: FavoriteBrandsType) => {
    try {
      await updateProfile({
        favorite_vehicle_brands: data.favorite_vehicle_brands,
      });
    } catch (error) {
      // Revert selection if update fails
      console.error("Failed to update favorite brands:", error);
    }
  };

  useEffect(() => {
    reset(profile || {});
  }, [profile]);

  if (loadingBrands || loadingProfile) return <Text>Loading...</Text>;
  if (brandsError) return <Text>Error: {brandsError.message}</Text>;

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 px-safe-offset-6">
        <Text className="text-white text-2xl font-bold py-4">
          Quelles sont tes marques préférées ?
        </Text>

        <ChipSelector<FavoriteBrandsType, ExtractId<BrandsType, "brand_id">>
          name="favorite_vehicle_brands"
          control={control}
          items={mapToId(brands, "brand_id")}
        />
      </View>

      <View className="absolute bottom-0 w-full px-4 pb-10 pt-4 bg-black z-10">
        <Button
          variant="secondary"
          label="Continuer"
          disabled={!isValid || isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
}
