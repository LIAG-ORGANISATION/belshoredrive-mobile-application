import { Button } from "@/components/ui/button";
import { CameraIcon } from "@/components/vectors/camera-icon";
import { GalleryIcon } from "@/components/vectors/gallery-icon";
import { useCreateVehicle, useUploadVehicleMedia } from "@/network/vehicles";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import * as ImageManipulator from "expo-image-manipulator";
import { SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import type { ImagePickerAsset } from "expo-image-picker";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	type SharedValue,
} from "react-native-reanimated";

const MAX_IMAGES = 15;

export default function CreateVehicle() {
	const [selectedIndex, setSelectedIndex] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(false);
	const { mutate: uploadMedia, data: mediaData } = useUploadVehicleMedia();
	const { mutate: createVehicle, data: vehicleData } = useCreateVehicle();
	const { width, height } = Dimensions.get("window");

	const sharedValuePool = Array.from({ length: MAX_IMAGES }).map(() => ({
		scale: useSharedValue(1),
		savedScale: useSharedValue(1),
		translateX: useSharedValue(0),
		savedTranslateX: useSharedValue(0),
		translateY: useSharedValue(0),
		savedTranslateY: useSharedValue(0),
	}));

	const [images, setImages] = useState<
		(ImagePickerAsset & { add?: boolean })[]
	>([
		{ uri: "", width: 0, height: 0, base64: "" },
		{ uri: "", width: 0, height: 0, base64: "" },
		{ uri: "", width: 0, height: 0, base64: "" },
		{ uri: "", width: 0, height: 0, base64: "" },
		{ uri: "", width: 0, height: 0, base64: "" },
		{ uri: "", width: 0, height: 0, base64: "", add: true },
	]);
	const [imageConfig, setImageConfig] = useState<
		Record<
			number,
			{
				scale: SharedValue<number>;
				savedScale: SharedValue<number>;
				translateX: SharedValue<number>;
				savedTranslateX: SharedValue<number>;
				translateY: SharedValue<number>;
				savedTranslateY: SharedValue<number>;
			}
		>
	>({
		0: {
			scale: useSharedValue(1),
			savedScale: useSharedValue(1),
			translateX: useSharedValue(0),
			savedTranslateX: useSharedValue(0),
			translateY: useSharedValue(0),
			savedTranslateY: useSharedValue(0),
		},
		1: {
			scale: useSharedValue(1),
			savedScale: useSharedValue(1),
			translateX: useSharedValue(0),
			savedTranslateX: useSharedValue(0),
			translateY: useSharedValue(0),
			savedTranslateY: useSharedValue(0),
		},
		2: {
			scale: useSharedValue(1),
			savedScale: useSharedValue(1),
			translateX: useSharedValue(0),
			savedTranslateX: useSharedValue(0),
			translateY: useSharedValue(0),
			savedTranslateY: useSharedValue(0),
		},
		3: {
			scale: useSharedValue(1),
			savedScale: useSharedValue(1),
			translateX: useSharedValue(0),
			savedTranslateX: useSharedValue(0),
			translateY: useSharedValue(0),
			savedTranslateY: useSharedValue(0),
		},
		4: {
			scale: useSharedValue(1),
			savedScale: useSharedValue(1),
			translateX: useSharedValue(0),
			savedTranslateX: useSharedValue(0),
			translateY: useSharedValue(0),
			savedTranslateY: useSharedValue(0),
		},
		5: {
			scale: useSharedValue(1),
			savedScale: useSharedValue(1),
			translateX: useSharedValue(0),
			savedTranslateX: useSharedValue(0),
			translateY: useSharedValue(0),
			savedTranslateY: useSharedValue(0),
		},
	});

	useEffect(() => {
		const initialConfig: typeof imageConfig = {};
		for (let i = 0; i < 6; i++) {
			initialConfig[i] = sharedValuePool[i];
		}
		setImageConfig(initialConfig);
	}, []);

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
			uri: "",
			width: 0,
			height: 0,
			base64: "",
			add: images.length < MAX_IMAGES,
		});
		setImages(newImages);

		// Use the next pre-initialized shared values from the pool
		const newIndex = images.length;
		if (newIndex < MAX_IMAGES) {
			setImageConfig((prevConfig) => ({
				...prevConfig,
				[newIndex]: sharedValuePool[newIndex],
			}));
		} else {
			console.warn("Reached maximum number of images");
		}
	};

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0,
			base64: true,
		});

		if (!result.canceled) {
			const newImages = [...images];
			newImages[selectedIndex] = result.assets[0];
			setImages(newImages);
		}
	};

	const dragHandler = Gesture.Pan()
		.onStart(() => {
			imageConfig[selectedIndex].savedTranslateX.value =
				imageConfig[selectedIndex].translateX.value;
			imageConfig[selectedIndex].savedTranslateY.value =
				imageConfig[selectedIndex].translateY.value;
		})
		.onChange((event) => {
			const maxTranslation =
				(imageConfig[selectedIndex].scale.value - 1) * width;

			const newTranslateX =
				imageConfig[selectedIndex].savedTranslateX.value + event.translationX;
			const newTranslateY =
				imageConfig[selectedIndex].savedTranslateY.value + event.translationY;

			imageConfig[selectedIndex].translateX.value = Math.min(
				Math.max(newTranslateX, -maxTranslation),
				maxTranslation,
			);
			imageConfig[selectedIndex].translateY.value = Math.min(
				Math.max(newTranslateY, -maxTranslation),
				maxTranslation,
			);
		});

	const pinchHandler = Gesture.Pinch()
		.onStart(() => {
			imageConfig[selectedIndex].savedScale.value =
				imageConfig[selectedIndex].scale.value;
		})
		.onChange((event) => {
			imageConfig[selectedIndex].scale.value =
				imageConfig[selectedIndex].savedScale.value * event.scale;
		})
		.onEnd(() => {
			imageConfig[selectedIndex].scale.value = Math.min(
				Math.max(imageConfig[selectedIndex].scale.value, 1),
				3,
			);
			imageConfig[selectedIndex].savedScale.value =
				imageConfig[selectedIndex].scale.value;

			const maxTranslation = (imageConfig[selectedIndex].scale.value - 1) * 20;
			imageConfig[selectedIndex].translateX.value = Math.min(
				Math.max(imageConfig[selectedIndex].translateX.value, -maxTranslation),
				maxTranslation,
			);
			imageConfig[selectedIndex].translateY.value = Math.min(
				Math.max(imageConfig[selectedIndex].translateY.value, -maxTranslation),
				maxTranslation,
			);

			imageConfig[selectedIndex].savedTranslateX.value =
				imageConfig[selectedIndex].translateX.value;
			imageConfig[selectedIndex].savedTranslateY.value =
				imageConfig[selectedIndex].translateY.value;
		});

	const composed = Gesture.Simultaneous(pinchHandler, dragHandler);

	const imageStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ translateX: imageConfig[selectedIndex].translateX.value || 0 },
				{ translateY: imageConfig[selectedIndex].translateY.value || 0 },
				{ scale: imageConfig[selectedIndex].scale.value || 1 },
			],
		};
	});

	const cropAndSaveImage = async () => {
		if (images.length === 0) return;

		setIsLoading(true);
		const uploadedImagesIds: string[] = [];

		let index = 0;
		for (const image of images) {
			if (!image.uri) continue;
			try {
				const center = {
					x: image.width / 2,
					y: image.height / 2,
				};
				let cropX: number;
				let cropY: number;
				let cropWidth: number;
				let cropHeight: number;

				if (imageConfig[index].scale.value > 1) {
					// Fixed aspect ratio 9:16
					const targetAspectRatio = 9 / 16;
					const imageAspectRatio = image.width / image.height;

					// Calculate crop dimensions to maintain 9:16 ratio
					const targetHeight = image.height / imageConfig[index].scale.value;
					const targetWidth = targetHeight * targetAspectRatio;

					if (Number(imageConfig[index].savedTranslateX.value) < 0) {
						cropX =
							center.x -
							(imageConfig[index].savedTranslateX.value * targetWidth) /
								((imageConfig[index].scale.value - 1) * width);
					} else if (imageConfig[index].savedTranslateX.value === 0) {
						cropX = center.x - targetWidth / 2;
					} else {
						cropX =
							(imageConfig[index].savedTranslateX.value * targetWidth) /
							((imageConfig[index].scale.value - 1) * width);
					}

					if (Number(imageConfig[index].savedTranslateY.value) < 0) {
						cropY =
							center.y -
							(imageConfig[index].savedTranslateY.value * targetHeight) /
								((imageConfig[index].scale.value - 1) * height);
					} else if (imageConfig[index].savedTranslateY.value === 0) {
						cropY = center.y - targetHeight / 2;
					} else {
						cropY =
							(imageConfig[index].savedTranslateY.value * targetHeight) /
							((imageConfig[index].scale.value - 1) * height);
					}
					cropWidth = targetWidth;
					cropHeight = targetHeight;
				} else {
					const targetAspectRatio = 9 / 16;
					const imageAspectRatio = image.width / image.height;

					if (imageAspectRatio > targetAspectRatio) {
						// Image is wider than target ratio - crop width
						cropHeight = image.height;
						cropWidth = image.height * targetAspectRatio;
						cropX = (image.width - cropWidth) / 2;
						cropY = 0;
					} else {
						// Image is taller than target ratio - crop height
						cropWidth = image.width;
						cropHeight = image.width / targetAspectRatio;
						cropX = 0;
						cropY = (image.height - cropHeight) / 2;
					}
				}

				const manipulatedImage = await ImageManipulator.manipulateAsync(
					image.uri,
					[
						{
							crop: {
								originX: cropX,
								originY: cropY,
								width: cropWidth,
								height: cropHeight,
							},
						},
					],
					{ compress: 1, format: SaveFormat.JPEG, base64: true },
				);

				uploadedImagesIds.push(manipulatedImage.base64 || "");

				setIsLoading(false);
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
					createVehicle(
						{
							// brand_id: "1",
							// model: "Model 1",
							media: media,
						},
						{
							onSuccess: (vehicle) => {
								router.push(`/create-vehicle/${vehicle.vehicle_id}`);
							},
						},
					);
				},
			},
		);
	};

	return (
		<View className="w-full h-fit max-h-screen flex-1 items-start justify-between pb-safe-offset-4 px-safe-offset-4 bg-black">
			<Text className="text-white text-2xl font-bold">
				Ajoutez les photos de votre véhicule
			</Text>
			<View className="w-full flex-1 flex-col items-center justify-between gap-4">
				<GestureHandlerRootView className="w-full aspect-square">
					<View className="w-full relative aspect-square rounded-lg overflow-hidden">
						{images[selectedIndex] && (
							<GestureDetector gesture={composed}>
								<Animated.View className="w-full h-full">
									<Animated.Image
										source={{ uri: images[selectedIndex].uri }}
										className="w-full h-full"
										style={[imageStyle]}
										resizeMode="contain"
									/>
								</Animated.View>
							</GestureDetector>
						)}
						<View className="absolute left-0 right-0 w-full h-full translate-x-1/2 pointer-events-none">
							<View
								className="w-3/5 my-auto mx-auto aspect-[0.65] rounded-lg border-2 border-white border-dashed drop-shadow-2xl"
								style={{
									overflow: "hidden",
									backgroundColor: "transparent",
									boxShadow: "0 0 200px 0 rgba(0, 0, 0, 0.8)",
								}}
							/>
						</View>
					</View>
				</GestureHandlerRootView>

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
							{item.uri.length > 0 ? (
								<Image
									source={{ uri: item.uri }}
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
					extraData={images}
				/>

				<View className="w-full flex-row gap-4 pb-4">
					<View className="flex-1">
						<Button
							className="justify-center py-2"
							variant="with-icon"
							label="Galerie"
							icon={<GalleryIcon />}
							onPress={pickImage}
						/>
					</View>
					<View className="flex-1">
						<Button
							className="justify-center py-2"
							variant="with-icon"
							label="Camera"
							icon={<CameraIcon />}
							onPress={pickImage}
						/>
					</View>
				</View>

				<View className="w-full flex-col gap-4">
					<View className="w-full">
						<Button
							className="w-full"
							variant="secondary"
							label="Continuer"
							disabled={images.length === 0 || isLoading}
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
}
