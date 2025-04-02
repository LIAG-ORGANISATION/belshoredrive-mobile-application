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
import {
	useFetchVehicleById,
	useFetchVehicleTypes,
	useUpdateVehicle,
} from "@/network/vehicles";

import { useLayoutEffect, useState } from "react";
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
	const [selectedVehicleType, setSelectedVehicleType] = useState<
		string | undefined
	>(undefined);

	const { data: vehicleTypes } = useFetchVehicleTypes(setSelectedVehicleType);
	const { data: vehicle, isLoading: loadingVehicle } =
		useFetchVehicleById(vehicleId);
	const {
		data: brands = [],
		isLoading: loadingBrands,
		error: brandsError,
	} = useFetchBrands(selectedVehicleType);
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
			{loadingBrands || loadingVehicle ? (
				<View className="flex flex-row flex-wrap gap-2 pb-4">
					{[...Array(10)].map((_, index) => (
						<SkeletonText key={uuidv4()} />
					))}
				</View>
			) : (
				<View className="flex-1">
					<View className="flex-1">
						<ChipSelector<ChooseBrandType, ExtractId<BrandsType, "brand_id">>
							name="brand_id"
							control={control}
							items={mapToId(brands, "brand_id")}
							selectedVehicleType={selectedVehicleType}
							types={vehicleTypes?.map((type) => ({
								label: type.label ?? "",
								id: type.id,
							}))}
							haveSearch={true}
							toggleType={setSelectedVehicleType}
							selectingType="single"
						/>
					</View>
					<Button
						variant="secondary"
						label="Continuer"
						disabled={!isValid || isSubmitting}
						onPress={handleSubmit(onSubmit)}
						className="mx-2 mb-10"
					/>
				</View>
			)}
		</View>
	);
};
