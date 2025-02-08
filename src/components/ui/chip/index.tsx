import { Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  useSharedValue,
  interpolateColor,
  withDelay,
} from "react-native-reanimated";

interface ChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export function Chip({ label, isSelected, onPress }: ChipProps) {
  const scale = useSharedValue(1);
  const colorProgress = useSharedValue(0);

  const triggerHeartbeat = () => {
    scale.value = withSequence(
      withTiming(1.05, { duration: 100 }),
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 }),
    );
    onPress();
  };

  // Animate color transition when isSelected changes
  if (isSelected) {
    colorProgress.value = withSpring(1);
  } else {
    colorProgress.value = withSpring(0);
  }

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
  }));

  return (
    <Pressable onPress={triggerHeartbeat}>
      <Animated.Text style={[animatedStyle, { fontSize: 14 }]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
}
