import cx from "classnames";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { withSequence, withTiming } from "react-native-reanimated";
import { Car } from "../vectors/car";
import { Moto } from "../vectors/moto";
import { Van } from "../vectors/van";

type TypesSelectorType = {
	types: { label: string; id: string }[];
	selectedType: string;
	toggleTypes: (value: string) => void;
};

type TypesChipType = {
	label: string;
	isSelected: boolean;
	onPress: () => void;
};

export const TypesChip = ({ label, isSelected, onPress }: TypesChipType) => {
	const scale = useSharedValue(1);
	const colorProgress = useSharedValue(isSelected ? 1 : 0);

	const triggerHeartbeat = (): void => {
		onPress();

		scale.value = withSequence(
			withTiming(1.05, { duration: 100 }),
			withTiming(0.95, { duration: 100 }),
			withTiming(1, { duration: 100 }),
		);
	};

	const className = cx({
		"w-fit border leading-5 border-[#545454] px-4 py-3 rounded text-sm text-white capitalize font-semibold flex flex-row items-center gap-2": true,
		"bg-primary": isSelected,
		"bg-zinc-800": !isSelected,
	});

	const textClassName = cx({
		"text-sm font-semibold capitalize": true,
		"text-white": isSelected,
		"text-zinc-400": !isSelected,
	});

	const Icon = () => {
		switch (label) {
			case "van":
				return <Van />;
			case "voiture":
				return <Car />;
			case "moto":
				return <Moto />;
			default:
				return null;
		}
	}

	useEffect(() => {
		colorProgress.set(isSelected ? 1 : 0);
	}, [isSelected]);

	return (
		<Pressable
			onPress={triggerHeartbeat}
			className={className}
		>
			<Icon />
			<Text className={textClassName}>{label}</Text>
		</Pressable>
	);
};

export const TypesSelector = ({
	types,
	selectedType,
	toggleTypes,
}: TypesSelectorType) => {
	return (
		<View className="mb-4 flex flex-row gap-4">
			{types.map((item) => (
				<TypesChip
					label={item.label}
					onPress={() => toggleTypes(item.id)}
					isSelected={selectedType === item.id}
					key={item.id}
				/>
			))}
		</View>
	);
};
