import cx from "classnames";
import type { FieldError, FieldValues, Path } from "react-hook-form";
import { Text, TextInput, type TextInputProps, View } from "react-native";

interface InputProps<T> extends TextInputProps {
	error?: FieldError;
	name: Path<T>;
	classes?: string;
	icon?: React.ReactNode;
	onFocus?: () => void;
	onBlur?: () => void;
}

export const Input = <T extends FieldValues>({
	error,
	icon,
	onFocus,
	onBlur,
	...props
}: InputProps<T>) => {
	const classes = cx({
		"text-white text-sm bg-neutral-800 px-4 py-2 border border-neutral-700 rounded-lg focus:border-gray-600 h-12": true,
		"!border-red-500 !focus:border-red-500": error,
	});
	return (
		<View className="w-full relative">
			{icon && (
				<View className="absolute w-6 h-6 right-4 top-1/3 -translate-y-1/2 z-10">
					{icon}
				</View>
			)}
			<TextInput
				{...props}
				className={`${classes} ${props.classes || ""}`}
				placeholderTextColor="#ffffff70"
				onFocus={onFocus}
				onBlur={onBlur}
			/>
			{error && (
				<Text className="text-red-500 text-xs mt-1">{error.message}</Text>
			)}
		</View>
	);
};
