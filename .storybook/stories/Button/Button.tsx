import React from "react";
import { Text, TouchableOpacity } from "react-native";

export type MyButtonProps = {
  onPress?: () => void;
  text: string;
};

export const MyButton = ({ onPress, text }: MyButtonProps) => {
  return (
    <TouchableOpacity
      className="bg-blue-500 p-4 rounded-md"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text className="text-black">{text}</Text>
    </TouchableOpacity>
  );
};


