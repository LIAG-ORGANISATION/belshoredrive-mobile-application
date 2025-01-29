import React, { useEffect, useMemo } from "react";
import { Animated, View } from "react-native";

type CarouselNavigatorProps = {
  currentIndex: number;
  totalItems: number;
};

export const CarouselNavigator = ({
  currentIndex = 0,
  totalItems = 3,
}: CarouselNavigatorProps) => {
  const animatedValues = useMemo(
    () =>
      Array.from({ length: totalItems }).map(
        (_, index) => new Animated.Value(index === 0 ? 1 : 0),
      ),
    [totalItems],
  );

  useEffect(() => {
    animatedValues.forEach((value, index) => {
      Animated.timing(value, {
        toValue: index === currentIndex ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [currentIndex, animatedValues]);

  return (
    <View className="w-full flex-row items-center justify-center gap-2">
      {animatedValues.map((animValue, index) => (
        <Animated.View
          key={`${index}-${Math.random()}`}
          className="flex-1 h-1 rounded-full bg-white"
          style={{
            opacity: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
          }}
        />
      ))}
    </View>
  );
};
