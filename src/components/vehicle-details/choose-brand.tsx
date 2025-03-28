import { Text, View } from "react-native";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";

import { ChipSelector } from "@/components/chip-selector";
import { Button } from "@/components/ui/button";
import { SkeletonText } from "@/components/ui/skeleton-text";

import type { ExtractId } from "@/lib/helpers/extract-id";
import { mapToId } from "@/lib/helpers/map-to-id";
import {
	type ChooseBrandType,
	chooseBrandSchema,
} from "@/lib/schemas/create-vehicle";
import { type BrandsType, useFetchBrands } from "@/network/brands";
import { useFetchVehicleById, useUpdateVehicle } from "@/network/vehicles";

import { useLayoutEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export type ChooseBrandProps = {
	title: string;
	subtitle?: string;
	vehicleId: string;
	onSubmitCallback: (data: ChooseBrandType) => void;
};

export const ChooseBrand = ({
	title,
	subtitle,
	vehicleId,
	onSubmitCallback,
}: ChooseBrandProps) => {
	const {
		data: brands = [],
		isLoading: loadingBrands,
		error: brandsError,
	} = useFetchBrands();
	const { data: vehicle, isLoading: loadingVehicle } =
		useFetchVehicleById(vehicleId);
	const { mutate: updateVehicle } = useUpdateVehicle();
	const {
		control,
		reset,
		handleSubmit,
		formState: { isValid, isSubmitting },
	} = useForm<ChooseBrandType>({
		resolver: valibotResolver(chooseBrandSchema),
		defaultValues: {
			brand_id: vehicle?.brand_id ?? "",
		},
	});

	const onSubmit = async (data: ChooseBrandType) => {
		try {
			await updateVehicle(
				{
					vehicleId,
					updates: {
						brand_id: data.brand_id,
					},
				},
				{
					onSuccess: () => {
						onSubmitCallback(data);
					},
				},
			);
		} catch (error) {
			// Revert selection if update fails
			console.error("Failed to update favorite brands:", error);
		}
	};

	useLayoutEffect(() => {
		reset({
			brand_id: vehicle?.brand_id ?? "",
		});
	}, [vehicle]);

	if (brandsError) return <Text>Error: {brandsError.message}</Text>;

	return (
		<View className="flex-1">
			<Text className="text-white text-2xl font-bold py-4">{title}</Text>
			{subtitle && (
				<Text className="text-white/70 text-lg font-medium mb-2">
					{subtitle}
				</Text>
			)}
			{/* TODO: Make it as generic components for all screen that needs this */}
			{loadingBrands || loadingVehicle ? (
				<View className="flex flex-row flex-wrap gap-2 pb-4">
					{[...Array(10)].map((_, index) => (
						<SkeletonText key={uuidv4()} />
					))}
				</View>
			) : (
				<View className="flex-1">
					<View className="min-h-[500px]">
						<ChipSelector<ChooseBrandType, ExtractId<BrandsType, "brand_id">>
							name="brand_id"
							control={control}
							items={mapToId(brands, "brand_id")}
							haveSearch={true}
							selectingType="single"
						/>
					</View>
					<View className="flex-1">
						<Button
							variant="secondary"
							label="Continuer"
							disabled={!isValid || isSubmitting}
							onPress={handleSubmit(onSubmit)}
							/>
						</View>
				</View>
			)}
		</View>
	);
};
