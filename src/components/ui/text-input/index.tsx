import { TextInput, TextInputProps } from "react-native";

export const Input = (props: TextInputProps) => {
  return (
    <TextInput
      className="text-white text-sm bg-neutral-800 px-4 py-3.5 border border-neutral-600 rounded-lg focus:border-gray-500 h-16"
      {...props}
    />
  );
};
