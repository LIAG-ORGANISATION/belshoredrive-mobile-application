import { View } from "react-native";
import Animated, {
	useAnimatedStyle,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";

export const SkeletonGrid = ({ columns = 3, items = 9 }) => {
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
		<View className="flex-row flex-wrap">
			{Array(items)
				.fill(null)
				.map((_, index) => (
					<View key={index} className="w-1/3 aspect-square p-1">
						<Animated.View
							style={animatedStyle}
							className="w-full h-full bg-gray-700 rounded-sm"
						/>
					</View>
				))}
		</View>
	);
};
