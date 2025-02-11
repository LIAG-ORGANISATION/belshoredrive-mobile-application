import { Button } from "@/components/ui/button";
import { CameraIcon } from "@/components/vectors/camera-icon";
import { GalleryIcon } from "@/components/vectors/gallery-icon";
import * as ImageManipulator from "expo-image-manipulator";
import { SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  PinchGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

export default function PickAvatar() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
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
      const maxTranslation = (scale.value - 1) * 150;

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

      const maxTranslation = (scale.value - 1) * 150;
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

    // Calculate the crop region based on current scale and translation
    const viewportSize = 300; // Assuming the view is 300x300
    const cropSize = viewportSize / scale.value;

    // Center point adjustments based on translation
    const centerX = viewportSize / 2 - translateX.value / scale.value;
    const centerY = viewportSize / 2 - translateY.value / scale.value;

    // Calculate crop origin (top-left corner)
    const originX = centerX - cropSize / 2;
    const originY = centerY - cropSize / 2;

    console.log("originX", originX);
    console.log("originY", originY);
    console.log("cropSize", cropSize);
    console.log("scale", scale.value);
    console.log("translateX", translateX.value);
    console.log("translateY", translateY.value);

    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        image,
        [
          {
            crop: {
              originX: originX,
              originY: originY,
              width: cropSize,
              height: cropSize,
            },
          },
        ],
        { compress: 1, format: SaveFormat.JPEG },
      );

      // Here you can handle the cropped image (manipulatedImage.uri)
      console.log("Cropped image URI:", manipulatedImage.uri);
      // You might want to save this to state or pass it to the next screen
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  return (
    <View className="w-full h-fit max-h-screen flex-1 items-start justify-between pb-safe-offset-4 px-safe-offset-6 bg-black">
      <View className="w-full flex-1 flex-col items-center justify-between gap-4">
        <Text className="text-white text-2xl font-bold">
          Ajoutez votre avatar
        </Text>

        <GestureHandlerRootView className="w-full aspect-square">
          <View className="w-full relative aspect-square rounded-lg overflow-hidden">
            {image && (
              <GestureDetector gesture={composed}>
                <Animated.View className="w-full h-full">
                  <Animated.Image
                    source={{ uri: image }}
                    className="w-full h-full"
                    style={[imageStyle]}
                    resizeMode="cover"
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

        <View className="w-full flex-col gap-4">
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
