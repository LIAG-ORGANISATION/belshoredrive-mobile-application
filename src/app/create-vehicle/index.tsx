import { Button } from "@/components/ui/button";
import { CameraIcon } from "@/components/vectors/camera-icon";
import { GalleryIcon } from "@/components/vectors/gallery-icon";
import { useUploadVehicleMedia } from "@/network/vehicles";
import { Ionicons } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import { SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import type { ImagePickerAsset } from "expo-image-picker";
import { Link } from "expo-router";
import { useState } from "react";
import {
	Dimensions,
	FlatList,
	Image,
	Pressable,
	Text,
	View,
} from "react-native";
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

export default function CreateVehicle() {
	//   const [image, setImage] = useState<ImagePickerAsset | null>(null);
	const [selectedIndex, setSelectedIndex] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(false);
	const { mutate: uploadMedia } = useUploadVehicleMedia();
	const { width, height } = Dimensions.get("window");

	const [images, setImages] = useState<ImagePickerAsset[]>([
		{ uri: "", width: 0, height: 0, base64: "" },
		{ uri: "", width: 0, height: 0, base64: "" },
		{ uri: "", width: 0, height: 0, base64: "" },
		{ uri: "", width: 0, height: 0, base64: "" },
		{ uri: "", width: 0, height: 0, base64: "" },
	]);
	const [imageConfig, setImageConfig] = useState<
		Record<
			string,
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
		"0": {
			scale: useSharedValue(1),
			savedScale: useSharedValue(1),
			translateX: useSharedValue(0),
			savedTranslateX: useSharedValue(0),
			translateY: useSharedValue(0),
			savedTranslateY: useSharedValue(0),
		},
		"1": {
			scale: useSharedValue(1),
			savedScale: useSharedValue(1),
			translateX: useSharedValue(0),
			savedTranslateX: useSharedValue(0),
			translateY: useSharedValue(0),
			savedTranslateY: useSharedValue(0),
		},
		"2": {
			scale: useSharedValue(1),
			savedScale: useSharedValue(1),
			translateX: useSharedValue(0),
			savedTranslateX: useSharedValue(0),
			translateY: useSharedValue(0),
			savedTranslateY: useSharedValue(0),
		},
		"3": {
			scale: useSharedValue(1),
			savedScale: useSharedValue(1),
			translateX: useSharedValue(0),
			savedTranslateX: useSharedValue(0),
			translateY: useSharedValue(0),
			savedTranslateY: useSharedValue(0),
		},
		"4": {
			scale: useSharedValue(1),
			savedScale: useSharedValue(1),
			translateX: useSharedValue(0),
			savedTranslateX: useSharedValue(0),
			translateY: useSharedValue(0),
			savedTranslateY: useSharedValue(0),
		},
		"5": {
			scale: useSharedValue(1),
			savedScale: useSharedValue(1),
			translateX: useSharedValue(0),
			savedTranslateX: useSharedValue(0),
			translateY: useSharedValue(0),
			savedTranslateY: useSharedValue(0),
		},
	});

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

		for (const [index, image] of images.entries()) {
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

					// Set final crop dimensions to maintain 9:16 ratio
					cropWidth = targetWidth;
					cropHeight = targetHeight;
				} else {
					// When not scaled, still maintain 9:16 aspect ratio
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

				//   await uploadMedia({
				//     file: manipulatedImage.base64 || "",
				//     fileExt: image.uri.split(".")[1],
				//   });
				setIsLoading(false);
				console.log(manipulatedImage.uri);
				//   router.push("/complete-profile/profile-details");
			} catch (error) {
				console.error("Error cropping image:", error);
			}
		}

		console.log(uploadedImagesIds);
		uploadMedia(
			uploadedImagesIds.map((base64) => ({
				base64,
				fileExt: "jpg",
			})),
		);
	};

	return (
		<View className="w-full h-fit max-h-screen flex-1 items-start justify-between pb-safe-offset-4 px-safe-offset-6 bg-black">
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

				<FlatList
					data={images}
					horizontal
					className="max-h-32 w-full"
					showsHorizontalScrollIndicator={false}
					renderItem={({ item, index }) => (
						<Pressable
							onPress={() => setSelectedIndex(index)}
							className={`h-32 aspect-[10/16] mr-2 rounded-lg overflow-hidden ${
								selectedIndex === index
									? "border-2 border-white"
									: "border-2 border-dashed border-white/40 bg-white/10"
							}`}
						>
							{item.uri ? (
								<Image
									source={{ uri: item.uri }}
									className="w-full h-full"
									//   style={[
									//     {
									//       transform: [
									//         {
									//           translateX: imageConfig[index].translateX.value,
									//         },
									//         {
									//           translateY: imageConfig[index].translateY.value,
									//         },
									//         { scale: imageConfig[index].scale.value },
									//       ],
									//     },
									//   ]}
									resizeMode="cover"
								/>
							) : (
								<View className="w-full h-full items-center justify-center bg-white/10">
									<Ionicons name="camera-outline" size={24} color="white" />
								</View>
							)}
						</Pressable>
					)}
					keyExtractor={(_, index) => index.toString()}
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
