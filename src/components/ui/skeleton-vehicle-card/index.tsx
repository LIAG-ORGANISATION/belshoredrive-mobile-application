import { View } from "react-native";
import Animated, {
	useAnimatedStyle,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";

export const SkeletonVehicleCard = () => {
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
		<View className="rounded-2xl mb-4 relative h-[500px]">
			<Animated.View
				style={animatedStyle}
				className="w-full h-full rounded-2xl bg-gray-800"
			/>
			<View className="absolute bottom-4 left-4 right-4">
				{/* Nickname skeleton */}
				<Animated.View
					style={animatedStyle}
					className="h-6 w-32 rounded-md bg-gray-700 mb-2"
				/>
				{/* Vehicle name skeleton */}
				<Animated.View
					style={animatedStyle}
					className="h-7 w-48 rounded-md bg-gray-700 mb-4"
				/>
				{/* User info skeleton */}
				<View className="flex-row items-center mt-4">
					<Animated.View
						style={animatedStyle}
						className="w-6 h-6 rounded-full bg-gray-700 mr-2"
					/>
					<Animated.View
						style={animatedStyle}
						className="h-4 w-24 rounded-md bg-gray-700"
					/>
				</View>
			</View>
		</View>
	);
};
