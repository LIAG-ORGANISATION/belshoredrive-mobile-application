import Animated, {
	useAnimatedStyle,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";

export const SkeletonText = ({ width = "w-32" }: { width?: string }) => {
	const animatedStyle = useAnimatedStyle(() => ({
		opacity: withRepeat(
			withSequence(
				withTiming(0.3, { duration: 800 }),
				withTiming(0.7, { duration: 800 }),
			),
			-1,
			true,
		),
	}));

	return (
		<Animated.View
			style={animatedStyle}
			className={`h-6 ${width} rounded-md bg-gray-700`}
		/>
	);
};
