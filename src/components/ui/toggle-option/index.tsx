import cx from "classnames";
import { Switch, Text, View } from "react-native";

export const ToggleOption = ({
	title,
	description,
	isEnabled,
	toggleSwitch,
	isTop = false,
}: {
	title: string;
	description: string;
	isEnabled: boolean;
	toggleSwitch: () => void;
	isTop?: boolean;
}) => {
	const className = cx({
		"flex-row items-center justify-between py-1": true,
		"border-t border-zinc-800": !isTop,
	});
	return (
		<View className={className}>
			<View className="flex-1 gap-1">
				<Text className="text-white text-xl font-normal">{title}</Text>
				<Text className="text-zinc-400 text-base">{description}</Text>
			</View>
			<Switch
				trackColor={{ false: "#767577", true: "#81b0ff" }}
				thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
				ios_backgroundColor="#3e3e3e"
				onValueChange={toggleSwitch}
				value={isEnabled}
			/>
		</View>
	);
};
