import { Ionicons } from "@expo/vector-icons";
import type React from "react";
import { useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

type DrawerItemProps = {
	icon: React.ReactNode;
	label: string;
	value: string;
};

type DrawerProps = {
	items: DrawerItemProps[];
	className?: string;
};

const DrawerItem = ({
	item,
	lastItem,
}: { item: DrawerItemProps; lastItem: boolean }) => {
	const [expanded, setExpanded] = useState(false);
	const animatedHeight = useRef(new Animated.Value(0)).current;
	const iconRotation = useRef(new Animated.Value(0)).current;

	const toggleExpand = () => {
		const toValue = expanded ? 0 : 1;

		// Animate content height
		Animated.timing(animatedHeight, {
			toValue,
			duration: 300,
			useNativeDriver: false,
		}).start();

		// Animate icon rotation
		Animated.timing(iconRotation, {
			toValue,
			duration: 300,
			useNativeDriver: true,
		}).start();

		setExpanded(!expanded);
	};

	const maxHeight = animatedHeight.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 500], // Maximum height, will auto-adjust
	});

	const iconRotationDegree = iconRotation.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "45deg"],
	});

	return (
		<View
			className={`rounded-lg overflow-hidden ${lastItem ? "" : "border-b-2 border-white/20"}`}
		>
			<TouchableOpacity
				onPress={toggleExpand}
				className="flex-row items-center justify-between p-4"
				activeOpacity={0.7}
			>
				<View className="flex-row items-center">
					{item.icon}
					<Text className="ml-3 text-lg font-semibold text-white">
						{item.label}
					</Text>
				</View>

				<Animated.View style={{ transform: [{ rotate: iconRotationDegree }] }}>
					<Ionicons name="add" size={24} color="white" />
				</Animated.View>
			</TouchableOpacity>

			<Animated.View style={{ maxHeight }} className="overflow-hidden">
				<View className="p-4">
					<Text className="text-white/70">{item.value}</Text>
				</View>
			</Animated.View>
		</View>
	);
};

export const Drawer = ({ items, className = "" }: DrawerProps) => {
	return (
		<View className={`flex-1 mt-4 w-full ${className}`}>
			{items.map((item, index) => (
				<DrawerItem
					key={index}
					item={item}
					lastItem={index === items.length - 1}
				/>
			))}
		</View>
	);
};

export default Drawer;
