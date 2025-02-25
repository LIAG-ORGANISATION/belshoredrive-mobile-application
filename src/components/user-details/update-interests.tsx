import { valibotResolver } from "@hookform/resolvers/valibot";
import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";

import { ChipSelector } from "@/components/chip-selector";
import { Button } from "@/components/ui/button";
import type { ExtractId } from "@/lib/helpers/extract-id";
import { mapToId } from "@/lib/helpers/map-to-id";
import {
	type FavoriteInterestsType,
	favoriteInterests,
} from "@/lib/schemas/onboarding";
import { type InterestsType, useFetchInterests } from "@/network/interests";
import {
	useFetchUserProfile,
	useUpdateUserProfile,
} from "@/network/user-profile";

export type UpdateInterestsProps = {
	title?: string;
	onSubmitCallback: (data: FavoriteInterestsType) => void;
};

export const UpdateInterests = ({
	title,
	onSubmitCallback,
}: UpdateInterestsProps) => {
	const {
		data: interests = [],
		isLoading: loadingInterests,
		error: interestsError,
	} = useFetchInterests();

	const { data: profile, isLoading: loadingProfile } = useFetchUserProfile();
	const { mutate: updateProfile } = useUpdateUserProfile();

	const {
		control,
		handleSubmit,
		reset,
		formState: { isValid, isSubmitting },
	} = useForm<FavoriteInterestsType>({
		resolver: valibotResolver(favoriteInterests),
	});

	const onSubmit = async (data: FavoriteInterestsType) => {
		try {
			await updateProfile(data);
			onSubmitCallback(data);
		} catch (error) {
			console.error("Failed to update interests:", error);
		}
	};

	useEffect(() => {
		reset({
			interests: profile?.interests ?? [],
		});
	}, [profile]);

	if (loadingInterests || loadingProfile) return <Text>Loading...</Text>;
	if (interestsError) return <Text>Error: {interestsError.message}</Text>;

	return (
		<Fragment>
			{title && (
				<Text className="text-white text-2xl font-bold py-4">{title}</Text>
			)}

			<View className="flex-1">
				<ChipSelector<
					FavoriteInterestsType,
					ExtractId<InterestsType, "interest_id">
				>
					name="interests"
					control={control}
					items={mapToId(interests, "interest_id")}
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
		</Fragment>
	);
};
