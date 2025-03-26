import { FireWheelIcon } from "@/components/vectors/fire-wheel-icon";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	runOnJS,
} from "react-native-reanimated";

interface RateVehicleProps {
	onRatingChange?: (rating: number) => void;
	initialRating?: number;
}

export const RateVehicle = ({
	onRatingChange,
	initialRating = 0,
}: RateVehicleProps) => {
	const [rating, setRating] = useState<number>(initialRating);
	const isReadOnly = initialRating > 0;
	const position = useSharedValue(initialRating * 10); // Convert rating to percentage
	const timeoutRef = useRef<NodeJS.Timeout>(); // Add timeout ref

	const getRatingText = (value: number) => {
		if (value >= 8) return "Super hot !";
		if (value >= 6) return "Très bien !";
		if (value >= 4) return "Pas mal";
		if (value >= 2) return "Moyen";
		return "Peut mieux faire";
	};

	const updateRating = useCallback(
		(newRating: number) => {
			setRating(newRating);

			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				onRatingChange?.(newRating);
			}, 300);
		},
		[onRatingChange],
	);

	const gesture = Gesture.Pan()
		.enabled(!isReadOnly)
		.onUpdate((e) => {
			const newPosition = Math.max(0, Math.min(100, (e.x / 300) * 100));
			position.value = newPosition;
			const newRating = Math.round((newPosition / 100) * 10);
			if (newRating !== rating) {
				runOnJS(updateRating)(newRating);
			}
		});

	const sliderStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: (position.value * 300) / 100 }],
	}));

	const linearStyle = useAnimatedStyle(() => ({
		width: `${100 - position.value}%`,
	}));

	useLayoutEffect(() => {
		setRating(initialRating);
	}, [initialRating]);

	return (
		<View className="w-full items-center gap-6 py-12">
			<Text className="text-base font-semibold text-neutral-200">
				ÉVALUEZ CE VÉHICULE
			</Text>
			<Text className="text-white text-3xl font-bold">
				{getRatingText(rating)}
			</Text>
			<Text className="text-white text-base font-medium">
				Votre note: {rating} sur 10
			</Text>

			<GestureDetector gesture={gesture}>
				<View className="w-[300px] h-12 relative">
					<View className="w-full h-4 absolute top-3 rounded-full overflow-hidden">
						<LinearGradient
							colors={["#F5C148", "#FF2626"]}
							start={{ x: 0, y: 0.75 }}
							end={{ x: 1, y: 0.25 }}
							className="w-full h-full items-end"
						>
							<Animated.View
								className="flex-1 bg-[#2f2f2f] "
								style={linearStyle}
							/>
						</LinearGradient>
					</View>

					<Animated.View className="absolute top-0 -ml-6" style={sliderStyle}>
						<View className="w-12 h-12 items-center justify-center">
							<FireWheelIcon width={81} height={51} />
						</View>
					</Animated.View>
				</View>
			</GestureDetector>
		</View>
	);
};
