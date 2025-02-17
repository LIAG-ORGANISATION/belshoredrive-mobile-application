import { valibotResolver } from "@hookform/resolvers/valibot";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";

import { ChipSelector } from "@/components/chip-selector";
import { Button } from "@/components/ui/button";
import type { ExtractId } from "@/lib/helpers/extract-id";
import { mapToId } from "@/lib/helpers/map-to-id";
import {
  type UserServicesType,
  userServicesSchema,
} from "@/lib/schemas/complete-profile";
import { type ServicesType, useFetchServices } from "@/network/services";
import {
  useFetchUserProfile,
  useUpdateUserProfile,
} from "@/network/user-profile";

export type UpdateServicesProps = {
  title: string;
  onSubmitCallback: (data: UserServicesType) => void;
}

export const UpdateServices = ({ title, onSubmitCallback }: UpdateServicesProps) => {
  const {
    data: services = [],
    isLoading: loadingServices,
    error: servicesError,
  } = useFetchServices();

  const { data: profile, isLoading: loadingProfile } = useFetchUserProfile();
  const { mutate: updateProfile } = useUpdateUserProfile();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm<UserServicesType>({
    resolver: valibotResolver(userServicesSchema),
  });

  const onSubmit = async (data: UserServicesType) => {
    try {
      await updateProfile(data);

      onSubmitCallback(data);
    } catch (error) {
      console.error("Failed to update interests:", error);
    }
  };

  useEffect(() => {
    reset({
      services: profile?.services ?? []
    });
  }, [profile]);

  if (loadingServices || loadingProfile) return <Text>Loading...</Text>;
  if (servicesError) return <Text>Error: {servicesError.message}</Text>;

  return (
    <>
      <View className="flex-1 px-safe-offset-6 ">
        <Text className="text-white text-2xl font-bold py-4">
          {title}
        </Text>

        <ChipSelector<UserServicesType, ExtractId<ServicesType, "service_id">>
          name="services"
          control={control}
          items={mapToId(services, "service_id")}
        />
      </View>

      <View className="bottom-0 w-full px-4 pb-10 pt-4 bg-black z-10 inset-x-0">
        <Button
          variant="secondary"
          label="Continuer"
          disabled={!isValid || isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </>
  );
}
