import { useState } from "react";
import {
  FlatList,
  ImageBackground,
  StatusBar,
  Text,
  View,
  type ViewToken,
} from "react-native";

import { Button } from "@/components/ui/button";
import { CarouselNavigator } from "@/components/ui/carousel/carousel-navigator";
import { Logo } from "@/components/vectors/logo";
import { Dimensions } from "react-native";

export default function OnboardingIntro() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [pageY, setPageY] = useState(0);
  const data = [
    {
      image: require("../../../assets/images/login/intro-1.jpg"),
      title:
        "Partager votre passion sur un réseau dédié à l'auto-moto & vanlife",
    },
    {
      image: require("../../../assets/images/login/intro-2.png"),
      title:
        "Obtenez du soutien pour vos projets de restauration et de customisation",
    },
    {
      image: require("../../../assets/images/login/intro-3.jpg"),
      title: "Trouvez d’autres passionnés à proximité",
    },
  ];

  const changeIndex = (
    value: ViewToken<{
      image: number;
      title: string;
    }>[],
  ) => {
    if (value.length === 1) {
      setCurrentIndex(value[0].index || 0);
    } else if (currentIndex === 0) {
      setCurrentIndex(value[1].index || 1);
    } else if (currentIndex === 1 && value[1].index === 1) {
      setCurrentIndex(value[0].index || 0);
    } else if (currentIndex === 1 && value[1].index === 2) {
      setCurrentIndex(value[1].index || 2);
    } else if (currentIndex === 2) {
      setCurrentIndex(value[0].index || 0);
    }
  };

  return (
    <View className="w-full flex-1 items-center justify-between h-screen p-safe-offset-6">
      <StatusBar translucent backgroundColor="transparent" />
      <FlatList
        data={data}
        className="absolute w-screen h-screen"
        horizontal
        onViewableItemsChanged={(value) => changeIndex(value.viewableItems)}
        bounces={false}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <ImageBackground
            source={item.image}
            className={`flex-1 w-screen h-full bg-contain transition-opacity duration-300 fade-in bg-opacity-0`}
          >
            <Text
              className="text-2xl font-extrabold text-white text-center px-10 w-screen"
              style={{
                position: "absolute",
                bottom: Dimensions.get("window").height - pageY + 16,
              }}
            >
              {data[currentIndex].title}
            </Text>
          </ImageBackground>
        )}
      />
      <Logo />
      <View
        className="w-full flex flex-col gap-6"
        onLayout={(event) => {
          setPageY(event.nativeEvent.layout.y);
        }}
      >
        <CarouselNavigator currentIndex={currentIndex} totalItems={3} />
        <View className="flex-col w-full gap-4">
          <Button
            variant="secondary"
            label="Créer un compte"
            onPress={() => {
              console.log("Créer un compte");
            }}
          />
          <Button
            variant="primary"
            label="Se connecter"
            onPress={() => {
              console.log("Se connecter");
            }}
          />
        </View>
      </View>
    </View>
  );
}
