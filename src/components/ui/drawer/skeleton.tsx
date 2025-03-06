import React from "react";
import { View } from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withRepeat,
	withTiming,
	Easing,
} from "react-native-reanimated";

type DrawerSkeletonProps = {
	itemCount?: number;
	className?: string;
};

export const DrawerItemSkeleton = ({ lastItem }: { lastItem: boolean }) => {
	const opacity = useSharedValue(0.3);

	React.useEffect(() => {
		opacity.value = withRepeat(
			withTiming(0.7, { duration: 1000, easing: Easing.ease }),
			-1,
			true,
		);
	}, []);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
		};
	});

	return (
		<View className={`${!lastItem ? "mb-4" : ""}`}>
			<View className="flex-row items-center justify-between p-4 rounded-md bg-gray-800">
				<View className="flex-row items-center">
					{/* Icon placeholder */}
					<Animated.View
						style={animatedStyle}
						className="w-6 h-6 rounded-full bg-gray-600"
					/>

					{/* Label placeholder */}
					<Animated.View
						style={animatedStyle}
						className="ml-3 h-5 w-32 rounded-md bg-gray-600"
					/>
				</View>

				{/* Plus icon placeholder */}
				<Animated.View
					style={animatedStyle}
					className="w-6 h-6 rounded-full bg-gray-600"
				/>
			</View>
		</View>
	);
};

export const DrawerSkeleton = ({
	itemCount = 3,
	className = "",
}: DrawerSkeletonProps) => {
	return (
		<View className={`flex-1 mt-4 w-full ${className}`}>
			{Array(itemCount)
				.fill(0)
				.map((_, index) => (
					<DrawerItemSkeleton key={index} lastItem={index === itemCount - 1} />
				))}
		</View>
	);
};
