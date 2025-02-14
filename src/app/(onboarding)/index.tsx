import { valibotResolver } from "@hookform/resolvers/valibot";
import { router } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";

import { ChipSelector } from "@/components/chip-selector";
import { Button } from "@/components/ui/button";
import type { ExtractId } from "@/lib/helpers/extract-id";
import { mapToId } from "@/lib/helpers/map-to-id";
import {
  type RegionAndDepartmentsType,
  regionsAndDepartments,
} from "@/lib/schemas/onboarding";
import {
  type DepartmentType,
  useFetchDepartments,
} from "@/network/departments";
import {
  useFetchUserProfile,
  useUpdateUserProfile,
} from "@/network/user-profile";

export default function Onboarding() {
  const {
    data: departments = [],
    isLoading: loadingDepts,
    error: deptsError,
  } = useFetchDepartments();
  const { data: profile, isLoading: loadingProfile } = useFetchUserProfile();
  const { mutate: updateProfile } = useUpdateUserProfile();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm<RegionAndDepartmentsType>({
    resolver: valibotResolver(regionsAndDepartments),
  });

  // // Initialize selected departments from profile

  const onSubmit = async (data: RegionAndDepartmentsType) => {
    try {
      await updateProfile(data);
      router.push("/(onboarding)/brands");
    } catch (error) {
      console.error("Failed to update viewable departments:", error);
    }
  };

  useEffect(() => {
    reset(profile || {});
  }, [profile]);

  if (loadingDepts || loadingProfile) return <Text>Loading...</Text>;
  if (deptsError) return <Text>Error: {deptsError.message}</Text>;

  return (
    <View className="flex-1 bg-black relative px-2">
      <Text className="text-white text-2xl font-bold py-4">
        Dans quelle(s) région(s) peut-on vous croiser ?{" "}
      </Text>

      <View className="flex-1">
        <ChipSelector<
          RegionAndDepartmentsType,
          ExtractId<DepartmentType, "department_id">
        >
          name="viewable_departments"
          control={control}
          items={mapToId(departments, "department_id")}
          haveSearch={true}
        />
    </View>

    <View className="absolute bottom-0 w-full px-4 pb-10 pt-4 bg-black z-50 inset-x-0">
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