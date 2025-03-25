import React, { useRef, useState } from "react";
import { Animated, Dimensions, Pressable, View } from "react-native";

export type TabsProps = {
	tabs: {
		content: React.ReactNode;
		icon: React.ReactNode;
		id: string;
	}[];
	initialTab?: number;
	onChange?: (index: number) => void;
};

export const Tabs = ({ tabs, initialTab = 0, onChange }: TabsProps) => {
	const [activeTab, setActiveTab] = useState(initialTab);
	const translateX = useRef(new Animated.Value(0)).current;

	const setActiveTabHandler = (index: number) => {
		setActiveTab(index);
		onChange?.(index);
	};

	const animateBorder = (index: number) => {
		Animated.spring(translateX, {
			toValue: index * (Dimensions.get("window").width / tabs.length),
			useNativeDriver: true,
		}).start();
	};

	return (
		<View className="flex-1 mt-2 flex flex-col pb-10">
			<View className="flex-row w-full relative mb-4">
				{tabs.map((tab, index) => (
					<Pressable
						key={tab.id}
						className="flex-1 justify-center items-center px-8 py-4 h-fit border-b-2 border-gray-700"
						onPress={() => {
							animateBorder(index);
							setActiveTabHandler(index);
						}}
					>
						{React.cloneElement(tab.icon as React.ReactElement, {
							color: activeTab === index ? "#ffffff" : "#757575",
						})}
					</Pressable>
				))}
				<Animated.View
					className="absolute bottom-0 h-0.5 bg-white w-[33.333%]"
					style={{
						transform: [{ translateX }],
					}}
				/>
			</View>
			<View className="w-full pt-4">{tabs[activeTab].content}</View>
		</View>
	);
};
