import { useEffect } from "react";
import { Pressable, Text } from "react-native";
import {
	useSharedValue,
	withSequence,
	withTiming,
} from "react-native-reanimated";

interface ChipProps {
	label: string;
	isSelected: boolean;
	onPress: () => void;
	isFilter?: boolean;
}

export function Chip({ label, isSelected, onPress }: ChipProps) {
	const scale = useSharedValue(1);
	const colorProgress = useSharedValue(isSelected ? 1 : 0);

	useEffect(() => {
		colorProgress.set(isSelected ? 1 : 0);
	}, [isSelected]);

	const triggerHeartbeat = (): void => {
		onPress();

		scale.value = withSequence(
			withTiming(1.05, { duration: 100 }),
			withTiming(0.95, { duration: 100 }),
			withTiming(1, { duration: 100 }),
		);
	};

	return (
		<Pressable onPress={triggerHeartbeat}>
			<Text
				className={`w-fit border border-[#545454] px-3 py-1 rounded-lg text-sm ${
					isSelected ? "bg-white text-black" : "text-white bg-[#141414]"
				}`}
			>
				{label}
			</Text>
		</Pressable>
	);
}
