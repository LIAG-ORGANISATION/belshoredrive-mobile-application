import { CopyIcon } from "@/components/vectors/copy-icon";
import { SuccessIcon } from "@/components/vectors/success-icon";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import Animated, {
	useAnimatedStyle,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { Button } from "../button";

export const CopyInput = ({ value }: { value: string }) => {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await Clipboard.setStringAsync(value);
			setIsCopied(true);
			setTimeout(() => {
				setIsCopied(false);
			}, 2000);
		} catch (err) {
			console.error("Failed to copy text:", err);
		}
	};

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: withTiming(isCopied ? 1 : 0, { duration: 200 }),
		transform: [
			{
				scale: withSpring(isCopied ? 1 : 0.8),
			},
		],
		position: "absolute",
	}));

	const copyIconStyle = useAnimatedStyle(() => ({
		opacity: withTiming(isCopied ? 0 : 1, { duration: 200 }),
		transform: [
			{
				scale: withSpring(isCopied ? 0.8 : 1),
			},
		],
	}));

	return (
		<Button
			variant="primary"
			className="w-full flex-row-reverse !justify-between border-white/20 border-2"
			label={value}
			onPress={handleCopy}
			icon={
				<Animated.View style={{ position: "relative" }}>
					<Animated.View style={copyIconStyle}>
						<CopyIcon />
					</Animated.View>
					<Animated.View style={animatedStyle}>
						<SuccessIcon />
					</Animated.View>
				</Animated.View>
			}
		/>
	);
};
