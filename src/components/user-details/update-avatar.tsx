import { Button } from "@/components/ui/button";
import { CameraIcon } from "@/components/vectors/camera-icon";
import { GalleryIcon } from "@/components/vectors/gallery-icon";
import { useUploadUserProfileMedia } from "@/network/user-profile";
import {
	type Config,
	type CropConfig,
	type PickerResult,
	openCamera,
	openCropper,
	openPicker,
} from "@baronha/react-native-multiple-image-picker";
import { Ionicons } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import { SaveFormat } from "expo-image-manipulator";
import { Link } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { CropCircleView } from "../vectors/crop-circle-view";

const config: Config = {
	maxSelect: 1,
	primaryColor: "#4aa8ba",
	backgroundDark: "#000000",
	numberOfColumn: 4,
	mediaType: "image",
	selectBoxStyle: "number",
	selectMode: "multiple",
	language: "system",
	theme: "dark",
	isHiddenOriginalButton: false,
	crop: {
		circle: true,
		ratio: [
			{
				title: "belshore profile ratio",
				width: 1,
				height: 1,
			},
		],
		defaultRatio: {
			title: "belshore profile ratio",
			width: 1,
			height: 1,
		},
	},
};

const cropConfig: CropConfig = {
	circle: true,
	freeStyle: false,
	ratio: [
		{
			title: "Belshore profile ratio",
			width: 1,
			height: 1,
		},
	],
	defaultRatio: {
		title: "Belshore profile ratio",
		width: 1,
		height: 1,
	},
	language: "system",
};

export const PickAvatar = ({
	onSuccess,
	title,
}: { onSuccess: () => void; title?: string }) => {
	const [image, setImage] = useState<Partial<PickerResult>>({
		path: "",
		width: 0,
		height: 0,
	});
	const [isLoading, setIsLoading] = useState(false);
	const { mutate: uploadMedia } = useUploadUserProfileMedia();

	const pickImage = async () => {
		try {
			const response = (await openPicker(config)) as PickerResult[];
			setImage(response[0]);
		} catch (e) {
			console.log(e);
		}
	};

	const handleCropPress = async () => {
		const croppedImage = await openCropper(image.path || "", cropConfig);
		setImage(croppedImage);
	};

	const handleCameraPress = async () => {
		try {
			const response = await openCamera({
				mediaType: "image",
				language: "system",
			});
			setImage(response);
		} catch (e) {
			console.log(e);
		}
	};

	const cropAndSaveImage = async () => {
		if (!image.path) return;

		setIsLoading(true);

		try {
			const manipulatedImage = await ImageManipulator.manipulateAsync(
				image.path,
				[],
				{ compress: 1, format: SaveFormat.JPEG, base64: true },
			);

			await uploadMedia({
				file: manipulatedImage.base64 || "",
				fileExt: image.path?.split(".")[1] || "",
			});
			setIsLoading(false);
			onSuccess();
		} catch (error) {
			console.error("Error cropping image:", error);
		}
	};

	return (
		<View className="w-full h-fit max-h-screen flex-1 items-start justify-between pb-safe-offset-4 px-safe-offset-4 bg-black">
			{title && <Text className="text-white text-2xl font-bold">{title}</Text>}
			<View className="w-full flex-1 flex-col items-center justify-between gap-4">
				<View className="w-full relative aspect-square rounded-lg overflow-hidden">
					{image && (
						<Image
							source={{ uri: image.path }}
							className="w-full h-full z-0"
							resizeMode="contain"
						/>
					)}
					{image.path?.includes("file://") && (
						<TouchableOpacity
							onPress={handleCropPress}
							className="absolute w-10 h-10 items-center justify-center rounded-full bg-white/10 top-[5%] left-[5%] z-20"
						>
							<Ionicons name="crop" size={24} color="white" />
						</TouchableOpacity>
					)}
					<View className="absolute left-0 right-0 w-full h-full translate-x-1/2 pointer-events-none">
						<CropCircleView onPress={handleCropPress} />
					</View>
				</View>

				<View className="w-full flex-col gap-4 pb-4">
					<Button
						className="w-full justify-center"
						variant="with-icon"
						label="Importer depuis la galerie"
						icon={<GalleryIcon />}
						onPress={pickImage}
					/>
					<Button
						className="w-full justify-center"
						variant="with-icon"
						label="Prendre une photo"
						icon={<CameraIcon />}
						onPress={handleCameraPress}
					/>
				</View>

				<View className="w-full flex-col gap-4">
					<View className="w-full">
						<Button
							className="w-full"
							variant="secondary"
							label="Continuer"
							disabled={!image || isLoading}
							onPress={cropAndSaveImage}
						/>
					</View>
					<Link href="/complete-profile" asChild>
						<Text className="text-white text-sm text-center font-semibold">
							Passer cette étape
						</Text>
					</Link>
				</View>
			</View>
		</View>
	);
};
