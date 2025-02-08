import { useEffect } from "react";
import { Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  useSharedValue,
  interpolateColor,
} from "react-native-reanimated";

interface ChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  isFilter?: boolean;
}

export function Chip({
  label,
  isSelected,
  onPress,
  isFilter = false,
}: ChipProps) {
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(
      colorProgress.value,
      [0, 1],
      ["rgb(17, 24, 39)", "rgb(255, 255, 255)"],
    ),
    color: interpolateColor(
      colorProgress.value,
      [0, 1],
      ["rgb(255, 255, 255)", "rgb(0, 0, 0)"],
    ),
    borderColor: "rgb(255, 255, 255)",
    borderWidth: 1,
    padding: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontSize: 14,
  }));

  const animatedStyleFilter = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      colorProgress.value,
      [0, 1],
      ["rgba(255, 255, 255, 0.2)", "rgb(74, 168, 186)"],
    ),
    color: "rgb(255, 255, 255)",
    fontWeight: "bold",
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    fontSize: 16,
    lineHeight: 24,
  }));

  return (
    <Pressable onPress={triggerHeartbeat}>
      <Animated.Text style={[isFilter ? animatedStyleFilter : animatedStyle]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
}
