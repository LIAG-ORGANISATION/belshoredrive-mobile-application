import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";

import { ChipSelector } from "@/components/chip-selector";
import { Button } from "@/components/ui/button";
import type { ExtractId } from "@/lib/helpers/extract-id";
import { mapToId } from "@/lib/helpers/map-to-id";

import {
	type ChooseTagsType,
	chooseTagsSchema,
} from "@/lib/schemas/create-vehicle";
import {
	type TagsType,
	useFetchVehicleById,
	useFetchVehicleTags,
	useUpdateVehicle,
} from "@/network/vehicles";
export type SelectTagsProps = {
	title?: string;
	subtitle?: string;
	vehicleId: string;
	onSubmitCallback: (data: ChooseTagsType) => void;
};

export const SelectTags = ({
	title,
	subtitle,
	vehicleId,
	onSubmitCallback,
}: SelectTagsProps) => {
	const {
		data: vehicle,
		isLoading: loadingVehicle,
		error: vehicleError,
	} = useFetchVehicleById(vehicleId);
	const {
		data: tags = [],
		isLoading: loadingTags,
		error: tagsError,
	} = useFetchVehicleTags(vehicleId);

	const { mutate: updateVehicle } = useUpdateVehicle();

	const {
		control,
		handleSubmit,
		reset,
		formState: { isValid, isSubmitting },
	} = useForm<ChooseTagsType>({
		resolver: valibotResolver(chooseTagsSchema),
		defaultValues: {
			tags: vehicle?.tags ?? [],
		},
	});

	const onSubmit = async (data: ChooseTagsType) => {
		try {
			await updateVehicle({
				vehicleId,
				updates: {
					tags: data.tags,
				},
			});
			onSubmitCallback(data);
		} catch (error) {
			console.error("Failed to update interests:", error);
		}
	};

	useEffect(() => {
		reset({
			tags: vehicle?.tags ?? [],
		});
	}, [vehicle]);

	if (loadingTags || loadingVehicle) return <Text>Loading...</Text>;
	if (tagsError) return <Text>Error: {tagsError.message}</Text>;

	return (
		<>
			{title && (
				<Text className="text-white text-2xl font-bold py-4">{title}</Text>
			)}
			{subtitle && (
				<Text className="text-white/70 text-lg font-medium mb-2">
					{subtitle}
				</Text>
			)}

			<View className="flex-1">
				<ChipSelector<ChooseTagsType, ExtractId<TagsType, "tag_id">>
					name="tags"
					control={control}
					haveSearch={true}
					items={mapToId(tags, "tag_id") as ExtractId<TagsType, "tag_id">[]}
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
		</>
	);
};
