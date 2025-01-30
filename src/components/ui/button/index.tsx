import cx from "classnames";
import React from "react";
import { Alert, Pressable, Text } from "react-native";

type ButtonPropsType = {
  label: string;
  variant: "primary" | "secondary";
};

export const Button = ({ label, variant }: ButtonPropsType) => {
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
    <Pressable onPress={() => Alert.alert("Action")} className={classes}>
      <Text className={textClasses}>{label}</Text>
    </Pressable>
  );
};
