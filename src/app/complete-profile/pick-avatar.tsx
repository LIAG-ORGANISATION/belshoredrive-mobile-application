import { Button } from "@/components/ui/button";
import { CameraIcon } from "@/components/vectors/camera-icon";
import { GalleryIcon } from "@/components/vectors/gallery-icon";
import { useUploadUserProfileMedia } from "@/network/user-profile";
import * as ImageManipulator from "expo-image-manipulator";
import { SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import type { ImagePickerAsset } from "expo-image-picker";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

export default function PickAvatar() {
  const [image, setImage] = useState<ImagePickerAsset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: uploadMedia } = useUploadUserProfileMedia();
  const { width, height } = Dimensions.get("window");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const dragHandler = Gesture.Pan()
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onChange((event) => {
      const maxTranslation = ((scale.value - 1) * width) / 2;

      const newTranslateX = savedTranslateX.value + event.translationX;
      const newTranslateY = savedTranslateY.value + event.translationY;

      translateX.value = Math.min(
        Math.max(newTranslateX, -maxTranslation),
        maxTranslation,
      );
      translateY.value = Math.min(
        Math.max(newTranslateY, -maxTranslation),
        maxTranslation,
      );
    });

  const pinchHandler = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onChange((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      scale.value = Math.min(Math.max(scale.value, 1), 3);
      savedScale.value = scale.value;

      const maxTranslation = (scale.value - 1) * 20;
      translateX.value = Math.min(
        Math.max(translateX.value, -maxTranslation),
        maxTranslation,
      );
      translateY.value = Math.min(
        Math.max(translateY.value, -maxTranslation),
        maxTranslation,
      );

      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composed = Gesture.Simultaneous(pinchHandler, dragHandler);

  const imageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const cropAndSaveImage = async () => {
    if (!image) return;

    setIsLoading(true);

    try {
      const center = {
        x: image.width / 2,
        y: image.height / 2,
      };
      let cropX: number;
      let cropY: number;
      let cropWidth: number;
      let cropHeight: number;

      if (scale.value > 1) {
        if (Number(savedTranslateX.value) < 0) {
          cropX =
            center.x -
            (savedTranslateX.value * (image.width / 2)) /
              ((scale.value - 1) * width) /
              2;
        } else if (savedTranslateX.value === 0) {
          cropX = center.x - image.width / 2 / scale.value;
        } else {
          cropX =
            (savedTranslateX.value * (image.width / 2)) /
            ((scale.value - 1) * width);
        }
        if (Number(savedTranslateY.value) < 0) {
          cropY =
            center.y -
            (savedTranslateY.value * (image.height / 2)) /
              ((scale.value - 1) * height) /
              2;
        } else if (savedTranslateY.value === 0) {
          cropY = center.y - image.height / 2 / scale.value;
        } else {
          cropY =
            (savedTranslateY.value * (image.height / 2)) /
            ((scale.value - 1) * height);
        }
        cropWidth = image.width / scale.value;
        cropHeight = image.height / scale.value;
      } else {
        cropX = 0;
        cropY = 0;
        cropWidth = image.width;
        cropHeight = image.height;
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

      await uploadMedia({
        file: manipulatedImage.base64 || "",
        fileExt: image.uri.split(".")[1],
      });
      setIsLoading(false);
      router.push("/complete-profile/profile-details");
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  return (
    <View className="w-full h-fit max-h-screen flex-1 items-start justify-between pb-safe-offset-4 px-safe-offset-6 bg-black">
      <Text className="text-white text-2xl font-bold">
        Ajoutez votre avatar
      </Text>
      <View className="w-full flex-1 flex-col items-center justify-between gap-4">
        <GestureHandlerRootView className="w-full aspect-square">
          <View className="w-full relative aspect-square rounded-lg overflow-hidden">
            {image && (
              <GestureDetector gesture={composed}>
                <Animated.View className="w-full h-full">
                  <Animated.Image
                    source={{ uri: image.uri }}
                    className="w-full h-full"
                    style={[imageStyle]}
                    resizeMode="contain"
                  />
                </Animated.View>
              </GestureDetector>
            )}
            <View className="absolute left-0 right-0 w-full h-full translate-x-1/2 pointer-events-none">
              <View
                className="w-10/12 my-auto mx-auto aspect-square rounded-full border-2 border-white drop-shadow-2xl"
                style={{
                  overflow: "hidden",
                  backgroundColor: "transparent",
                  boxShadow: "0 0 200px 0 rgba(0, 0, 0, 0.8)",
                }}
              />
            </View>
          </View>
        </GestureHandlerRootView>

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
            onPress={pickImage}
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
}
