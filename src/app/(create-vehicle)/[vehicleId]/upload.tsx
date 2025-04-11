import { Button } from "@/components/ui/button";
import { CameraIcon } from "@/components/vectors/camera-icon";
import { CropView } from "@/components/vectors/crop-view";
import { GalleryIcon } from "@/components/vectors/gallery-icon";
import { formatPicturesUri } from "@/lib/helpers/format-pictures-uri";
import {
	useDeleteVehicleMedia,
	useFetchVehicleById,
	useUpdateVehicle,
	useUploadVehicleMedia,
} from "@/network/vehicles";
import {
	type Config,
	type CropConfig,
	type PickerResult,
	openCamera,
	openCropper,
	openPicker,
} from "@baronha/react-native-multiple-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import * as ImageManipulator from "expo-image-manipulator";
import { SaveFormat } from "expo-image-manipulator";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Image,
	Pressable,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {} from "react-native-gesture-handler";

const MAX_IMAGES = 15;

const config: Config = {
	maxSelect: MAX_IMAGES,
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
		circle: false,
		ratio: [
			{
				title: "belshore ratio",
				width: 9,
				height: 16,
			},
		],
		defaultRatio: {
			title: "belshore ratio",
			width: 9,
			height: 16,
		},
	},
};

const cropConfig: CropConfig = {
	circle: false,
	freeStyle: false,
	ratio: [
		{
			title: "Belshore ratio",
			width: 9,
			height: 16,
		},
	],
	defaultRatio: {
		title: "Belshore ratio",
		width: 9,
		height: 16,
	},
	language: "system",
};

export default function UploadVehicleMedia() {
	const { vehicleId } = useLocalSearchParams();
	const { data: vehicle, isLoading: isVehicleLoading } = useFetchVehicleById(
		vehicleId as string,
	);
	const [loadingImages, setLoadingImages] = useState<boolean>(true);

	const [selectedIndex, setSelectedIndex] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(false);
	const { mutate: uploadMedia } = useUploadVehicleMedia();
	const { mutate: deleteMedia } = useDeleteVehicleMedia();
	const { mutate: updateVehicle } = useUpdateVehicle();
	const [images, setImages] = useState<
		(Partial<PickerResult> & { add?: boolean; base64?: string })[]
	>([
		{ path: "", width: 0, height: 0, base64: "" },
		{ path: "", width: 0, height: 0, base64: "" },
		{ path: "", width: 0, height: 0, base64: "" },
		{ path: "", width: 0, height: 0, base64: "" },
		{ path: "", width: 0, height: 0, base64: "" },
		{ path: "", width: 0, height: 0, base64: "", add: true },
	]);

	useEffect(() => {
		if (selectedIndex === images.length - 1) {
			addImage();
		}
	}, [selectedIndex]);

	const addImage = (index?: number) => {
		if (images.length >= MAX_IMAGES) {
			console.warn("Reached maximum number of images");
			images[images.length - 1].add = false;
			return;
		}
		if (index) {
			setSelectedIndex(index);
		}
		const newImages = [...images];
		newImages[images.length - 1].add = false;
		newImages.push({
			path: "",
			width: 0,
			height: 0,
			base64: "",
			add: images.length < MAX_IMAGES,
		});
		setImages(newImages);
	};

	const handleGalleryPress = async () => {
		try {
			const response = await openPicker(config);
			const newImages = [...images];
			for (const [index, item] of response.entries()) {
				if (selectedIndex + index >= MAX_IMAGES) {
					addImage(selectedIndex + index);
				}

				newImages[selectedIndex + index] = {
					path: item.path,
					width: item.width,
					height: item.height,
					base64: "",
					add: index < MAX_IMAGES,
				};
			}
			setImages(newImages);
		} catch (e) {
			console.log(e);
		}
	};

	const handleCropPress = async () => {
		const croppedImage = await openCropper(
			images[selectedIndex].path || "",
			cropConfig,
		);
		const newImages = [...images];
		newImages[selectedIndex] = {
			path: croppedImage.path,
			width: croppedImage.width,
			height: croppedImage.height,
			base64: "",
		};
		setImages(newImages);
	};
	const handleCameraPress = async () => {
		try {
			const response = await openCamera({
				mediaType: "image",
				cameraDevice: "back",
				language: "system",
			});
			const newImages = [...images];
			newImages[selectedIndex] = {
				path: response.path,
				width: response.width,
				height: response.height,
				base64: "",
			};
			setImages(newImages);
		} catch (e) {
			console.log(e);
		}
	};

	const cropAndSaveImage = async () => {
		if (images.length === 0) return;

		setIsLoading(true);
		const uploadedImagesIds: string[] = [];

		let index = 0;
		for (const image of images) {
			if (!image.path) continue;
			if (!image.path.includes("file://")) continue;

			try {
				const manipulatedImage = await ImageManipulator.manipulateAsync(
					image.path,
					[],
					{ compress: 1, format: SaveFormat.JPEG, base64: true },
				);

				uploadedImagesIds.push(manipulatedImage.base64 || "");

				index++;
			} catch (error) {
				console.error("Error cropping image:", error);
			}
		}
		uploadMedia(
			uploadedImagesIds.map((base64) => ({
				base64,
				fileExt: "jpg",
			})),
			{
				onSuccess: (media) => {
					updateVehicle(
						{
							vehicleId: vehicleId as string,
							updates: {
								media: [...(vehicle?.media || []), ...media],
							},
						},
						{
							onSuccess: (vehicle) => {
								setIsLoading(false);
								router.push(`/(create-vehicle)/${vehicle.vehicle_id}`);
							},
						},
					);
				},
			},
		);
	};

	const handleDeletePress = (index: number) => {
		if (
			images[index].path &&
			images[index].path.length > 0 &&
			!images[index].path.includes("file://")
		) {
			Alert.alert(
				"Confirmation",
				"Êtes-vous sûr de vouloir supprimer cette image?",
				[
					{
						text: "Annuler",
						style: "cancel",
					},
					{
						text: "Supprimer",
						onPress: () => {
							if (images[index].path) {
								deleteMedia(
									{
										mediaUUID: images[index].path,
										vehicleId: vehicleId as string,
									},
									{
										onSuccess: () => {
											const newImages = [...images];
											newImages[index] = {
												path: "",
												width: 0,
												height: 0,
												base64: "",
											};
											setImages(newImages);
										},
									},
								);
							}
						},
						style: "destructive",
					},
				],
			);
		} else {
			const newImages = [...images];
			newImages[index] = { path: "", width: 0, height: 0, base64: "" };
			setImages(newImages);
		}
	};

	useLayoutEffect(() => {
		if (vehicle?.media?.length && vehicle?.media?.length > 0) {
			const loadedImages: (Partial<PickerResult> & {
				add?: boolean;
				base64?: string;
			})[] = images;
			vehicle.media.map((media, index) => {
				loadedImages[index] = {
					path: media,
					width: 0,
					height: 0,
					base64: "",
					add: false,
				};
			});
			if (
				loadedImages.length < MAX_IMAGES &&
				!loadedImages[loadedImages.length - 1].add
			) {
				loadedImages.push({
					path: "",
					width: 0,
					height: 0,
					base64: "",
					add: true,
				});
			}
			setImages(loadedImages);
			setLoadingImages(false);
		} else if (vehicle?.media?.length === 0 && !isVehicleLoading) {
			setLoadingImages(false);
		}
	}, [vehicle]);

	if (isVehicleLoading || loadingImages) {
		return (
			<View className="w-full h-full items-center justify-center bg-black">
				<ActivityIndicator size="large" color="white" />
			</View>
		);
	}

	return (
		<View className="w-full h-fit max-h-screen flex-1 items-start justify-between pb-safe-offset-4 px-safe-offset-4 bg-black">
			<Text className="text-white text-2xl font-bold">
				Ajoutez les photos de votre véhicule
			</Text>
			<View className="w-full flex-1 flex-col items-center justify-between gap-4">
				<View className="w-full relative aspect-square rounded-lg overflow-hidden">
					{images[selectedIndex]?.path && (
						<Image
							source={{
								uri: formatPicturesUri("vehicles", images[selectedIndex].path),
							}}
							className="w-full h-full z-0"
							resizeMode="contain"
						/>
					)}
					{images[selectedIndex].path?.includes("file://") && (
						<TouchableOpacity
							onPress={handleCropPress}
							className="absolute w-10 h-10 items-center justify-center rounded-full bg-white/10 top-[5%] left-[5%] z-20"
						>
							<Ionicons name="crop" size={24} color="white" />
						</TouchableOpacity>
					)}
					{images[selectedIndex].path &&
						images[selectedIndex].path.length > 0 && (
							<TouchableOpacity
								onPress={() => handleDeletePress(selectedIndex)}
								className="absolute w-10 h-10 items-center justify-center rounded-full bg-white/10 top-[5%] right-[5%] z-20"
							>
								<Ionicons name="trash" size={24} color="white" />
							</TouchableOpacity>
						)}

					<View className="absolute left-0 right-0 w-full h-full translate-x-1/2 pointer-events-none z-10">
						<CropView onPress={handleCropPress} />
					</View>
				</View>

				<FlashList
					data={images}
					estimatedItemSize={128}
					className="h-32 max-h-32"
					horizontal={true}
					renderItem={({ item, index }) => (
						<Pressable
							onPress={() => {
								if (index <= MAX_IMAGES) {
									setSelectedIndex(index);
								}
							}}
							className={`h-32 aspect-[10/16] mr-2 rounded-lg overflow-hidden ${
								selectedIndex === index
									? "border-2 border-primary opacity-100"
									: "border-2 border-dashed border-white/40 bg-white/10 opacity-50"
							}`}
						>
							{item.path && item.path.length > 0 ? (
								<Image
									source={{
										uri: formatPicturesUri("vehicles", item.path),
									}}
									className="w-full h-full"
									resizeMode="cover"
								/>
							) : (
								<View className="w-full h-full items-center justify-center bg-white/10">
									{item.add ? (
										<Text className="text-white text-sm font-semibold">
											Ajouter
										</Text>
									) : (
										<Ionicons name="camera-outline" size={24} color="white" />
									)}
								</View>
							)}
							{!item.add && (
								<View
									className={`absolute w-6 h-6 bottom-2 left-2 right-0  flex items-center justify-center rounded-full ${
										selectedIndex === index ? "bg-primary " : "bg-black/50 "
									}`}
								>
									<Text className="text-white text-sm font-semibold">
										{index + 1}
									</Text>
								</View>
							)}
						</Pressable>
					)}
					extraData={[images, selectedIndex]}
				/>

				<View className="w-full flex-row gap-4 pb-4">
					<View className="flex-1">
						<Button
							className="justify-center py-2"
							variant="with-icon"
							label="Galerie"
							icon={<GalleryIcon />}
							onPress={handleGalleryPress}
						/>
					</View>
					<View className="flex-1">
						<Button
							className="justify-center py-2"
							variant="with-icon"
							label="Camera"
							icon={<CameraIcon />}
							onPress={handleCameraPress}
						/>
					</View>
				</View>

				<View className="w-full flex-col gap-4">
					<View className="w-full">
						<Button
							className="w-full"
							variant="secondary"
							label="Continuer"
							disabled={isLoading}
							onPress={cropAndSaveImage}
						/>
					</View>
				</View>
			</View>
		</View>
	);
}
