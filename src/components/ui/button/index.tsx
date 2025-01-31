import cx from "classnames";
import type React from "react";
import { Animated, Pressable, Text } from "react-native";

type ButtonPropsType = {
  label: string;
  variant: "primary" | "secondary";
  icon?: React.ReactNode;
  textPosition?: "left" | "center" | "right";
  onPress: () => void;
};

export const Button = ({ label, variant, onPress, textPosition = "center", icon }: ButtonPropsType) => {
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
    outputRange: variant === "secondary" ? ["#fff", "#333"] : ["#333", "#fff"],
  });

  const classes = cx({
    "flex w-full h-fit rounded-md px-6 py-3": true,
    "bg-gray-700 text-white": variant === "primary",
    "bg-white text-white": variant === "secondary",
    "flex-row items-center justify-center": textPosition === "center",
    "flex-row items-start justify-start items-center gap-4": textPosition === "left",
    "flex-row items-end justify-end": textPosition === "right",
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
        {icon && icon}
        <Text className={textClasses}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
};
