import { Fragment, useEffect } from "react";
import { Text, View } from "react-native";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";

import { ChipSelector } from "@/components/chip-selector";
import { Button } from "@/components/ui/button";
import { SkeletonText } from "@/components/ui/skeleton-text";

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

import { useFetchVehicleTypes } from "@/network/vehicles";
import { v4 as uuidv4 } from "uuid";

export type UpdateBrandsProps = {
	title: string;
	onSubmitCallback: (data: FavoriteBrandsType) => void;
};

export const UpdateBrands = ({
	title,
	onSubmitCallback,
}: UpdateBrandsProps) => {
	const { data: vehicleTypes, isLoading: loadingVehicleTypes } = useFetchVehicleTypes();
	const { data: profile, isLoading: loadingProfile } = useFetchUserProfile();
	const {
		data: brands = [],
		isLoading: loadingBrands,
		error: brandsError,
	} = useFetchBrands();

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

			onSubmitCallback(data);
		} catch (error) {
			// Revert selection if update fails
			console.error("Failed to update favorite brands:", error);
		}
	};

	useEffect(() => {
		reset({
			favorite_vehicle_brands: profile?.favorite_vehicle_brands ?? [],
		});
	}, [profile]);

	if (brandsError) return <Text>Error: {brandsError.message}</Text>;

	return (
		<Fragment>
			<Text className="text-white text-2xl font-bold py-4">{title}</Text>

			{/* TODO: Make it as generic components for all screen that needs this */}
			{loadingBrands || loadingProfile ? (
				<View className="flex flex-row flex-wrap gap-2 pb-4">
					{[...Array(10)].map((_, index) => (
						<SkeletonText key={uuidv4()} />
					))}
				</View>
			) : (
				<Fragment>
					<ChipSelector<FavoriteBrandsType, ExtractId<BrandsType, "brand_id">>
						name="favorite_vehicle_brands"
						control={control}
						items={mapToId(brands, "brand_id")}
						haveSearch={true}
					/>

					<View className="absolute bottom-0 w-full px-4 pb-10 pt-4 bg-black z-50 inset-x-0">
						<Button
							variant="secondary"
							label="Continuer"
							disabled={!isValid || isSubmitting}
							onPress={handleSubmit(onSubmit)}
						/>
					</View>
				</Fragment>
			)}
		</Fragment>
	);
};
