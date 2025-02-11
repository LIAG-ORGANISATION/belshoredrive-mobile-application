import { Button } from "@/components/ui/button";
import { CameraIcon } from "@/components/vectors/camera-icon";
import { GalleryIcon } from "@/components/vectors/gallery-icon";
import * as ImageManipulator from "expo-image-manipulator";
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
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions({
    writeOnly: true,
  });
  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

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

  const pinchHandler = Gesture.Pinch()
    .onChange((event) => {
      scale.value = event.scale;
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    })
    .onEnd(() => {
      // Limit min/max scale
      scale.value = Math.min(Math.max(scale.value, 1), 3);
    });

  const imageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View className="w-full h-fit max-h-screen flex-1 items-start justify-between pb-safe-offset-4 px-safe-offset-6 bg-black">
      <View className="w-full flex-1 flex-col items-center justify-between gap-4">
        <Text className="text-white text-2xl font-bold">
          Ajoutez votre avatar
        </Text>

        <GestureHandlerRootView className="w-full aspect-square">
          <View className="w-full relative aspect-square bg-black rounded-lg overflow-hidden">
            {image && (
              <GestureDetector gesture={pinchHandler}>
                <Animated.View className="w-full h-full">
                  <Animated.Image
                    source={{ uri: image }}
                    className="w-full h-full"
                    style={[imageStyle]}
                    resizeMode="cover"
                  />
                </Animated.View>
                <View className="w-full h-full rounded-full"></View>
              </GestureDetector>
            )}
            {/* <View className="absolute top-0 left-0 w-full h-full">
              <View className="absolute top-0 left-0 w-full h-full bg-black opacity-50" />
              {/* <View
                className="absolute w-full aspect-square rounded-full border-2 border-white"
                style={{
                  overflow: "hidden",
                  backgroundColor: "transparent",
                }}
              /> 
            </View>*/}
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
              onPress={() => {}}
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
