import cx from "classnames";
import type { FieldError, FieldValues, Path } from "react-hook-form";
import { Text, TextInput, type TextInputProps, View } from "react-native";

interface InputProps<T> extends TextInputProps {
  error?: FieldError;
  name: Path<T>;
}

export const Input = <T extends FieldValues>({
  error,
  ...props
}: InputProps<T>) => {
  const classes = cx({
    "text-white text-sm bg-neutral-800 px-4 py-3.5 border border-neutral-600 rounded-lg focus:border-gray-500 h-16": true,
    "!border-red-500 !focus:border-red-500": error,
  });
  return (
    <View className="w-full relative">
      <TextInput className={classes} {...props} />
      {error && (
        <Text className="text-red-500 absolute -bottom-6 text-xs">
          {error.message}
        </Text>
      )}
    </View>
  );
};
