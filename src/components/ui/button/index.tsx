import cx from "classnames";
import type React from "react";
import { Animated, Pressable, Text } from "react-native";

type ButtonPropsType = {
  label: string;
  variant: "primary" | "secondary" | "with-icon";
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onPress: () => void;
};

export const Button = ({
  label,
  variant,
  onPress,
  icon,
  disabled = false,
  className,
}: ButtonPropsType) => {
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
    outputRange: disabled
      ? ["#1F1F1F", "#1F1F1F"] // gray-600 for disabled state
      : variant === "secondary"
      ? ["#fff", "#a6a6a6"]
      : ["#333", "#404040"],
  });

  const classes = cx({
    "flex rounded-md flex-row items-center": true,
    "bg-gray-700 text-white": variant === "primary",
    "bg-white text-white": variant === "secondary",
    "px-6 py-3 justify-center": variant !== "with-icon",
    "gap-4 p-4 justify-start": variant === "with-icon",
    "bg-gray-800": disabled,
  });
  const textClasses = cx({
    "text-white text-md font-semibold":
      variant === "primary" || variant === "with-icon",
    "text-primary-500 text-md font-semibold": variant === "secondary",
    "text-lg": variant === "with-icon",
    "text-gray-500": disabled,
  });
  return (
    <Pressable
      onPressIn={handlePress}
      onPressOut={handleRelease}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View className={cx(classes, className)} style={{ backgroundColor }}>
        {icon && icon}
        {label && <Text className={textClasses}>{label}</Text>}
      </Animated.View>
    </Pressable>
  );
};
