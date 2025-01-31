import cx from "classnames";
import React from "react";
import { Animated, Pressable, Text } from "react-native";

type ButtonPropsType = {
  label: string;
  variant: "primary" | "secondary";
  onPress: () => void;
};

export const Button = ({ label, variant, onPress }: ButtonPropsType) => {
  const backgroundColorRef = new Animated.Value(0);
  const handlePress = () => {
    Animated.timing(backgroundColorRef, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  const handleRelease = () => {
    Animated.timing(backgroundColorRef, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const backgroundColor = backgroundColorRef.interpolate({
    inputRange: [0, 1],
    outputRange: variant === "secondary" ? ["#fff", "#000"] : ["#000", "#fff"],
  });

  const classes = cx({
    "flex items-center justify-center w-full h-fit rounded-md px-6 py-3": true,
    "bg-gray-700 text-white": variant === "primary",
    "bg-white text-white": variant === "secondary",
  });
  const textClasses = cx({
    "text-white text-md font-semibold": variant === "primary",
    "text-primary-500 text-md font-semibold": variant === "secondary",
  });
  return (
    <Pressable
      onPressIn={handlePress}
      onPressOut={handleRelease}
      onPress={onPress}
    >
      <Animated.View className={classes} style={{ backgroundColor }}>
        <Text className={textClasses}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
};
