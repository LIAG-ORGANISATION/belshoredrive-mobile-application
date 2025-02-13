import React, { useRef, useState } from "react";
import { Animated, Dimensions, Pressable, View } from "react-native";
import { v4 as uuidv4 } from "uuid";

type TabsProps = {
  tabs: {
    content: React.ReactNode;
    icon: React.ReactNode;
  }[];
};

export const Tabs = ({ tabs }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const animateBorder = (index: number) => {
    Animated.spring(translateX, {
      toValue: index * (Dimensions.get("window").width / tabs.length),
      useNativeDriver: true,
    }).start();
  };

  return (
    <View className="w-full mt-2">
      <View className="flex-row w-full relative">
        {tabs.map((tab, index) => (
          <Pressable
            key={`${uuidv4()}-${index}`}
            className="flex-1 justify-center items-center px-8 py-4 h-fit"
            onPress={() => {
              animateBorder(index);
              setActiveTab(index);
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
