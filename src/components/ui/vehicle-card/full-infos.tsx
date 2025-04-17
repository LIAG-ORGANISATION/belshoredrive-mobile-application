import { formatPicturesUri } from "@/lib/helpers/format-pictures-uri";
import { useGetSession } from "@/network/session";
import type { Tables } from "@/types/supabase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router, useNavigation } from "expo-router";
import { Fragment, useState } from "react";
import {
	FlatList,
	Image,
	Pressable,
	Text,
	View,
	type ViewToken,
} from "react-native";
import { CarouselNavigator } from "../carousel/carousel-navigator";

export const VehicleCardFullInfos = ({
	item,
	actionButton,
}: {
	item: Tables<"vehicles"> & {
		brands: Pick<Tables<"brands">, "name">;
		user_profiles: Pick<
			Tables<"user_profiles">,
			"pseudo" | "profile_picture_url"
		>;
	};
	actionButton?: React.ReactNode;
}) => {
	const { data: session } = useGetSession();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [screenWidth, setScreenWidth] = useState(0);
	const navigation = useNavigation();
	const changeIndex = (
		value: ViewToken<{
			image: number;
			title: string;
		}>[],
	) => {
		if (value.length > 0 && value[0].index !== null) {
			setCurrentIndex(value[0].index);
		}
	};
	return (
		<View key={item.vehicle_id} className="relative rounded-2xl mb-4 h-[500px]">
			{item.media && item.media.length > 0 && (
				<Fragment>
					<LinearGradient
						colors={["rgba(0,0,0,0.3)", "transparent"]}
						className="absolute top-0 left-0 right-0 h-10 w-full z-10"
					/>
					<View className="h-9 w-full absolute mx-auto  left-0 right-0 flex-row justify-center items-center z-10">
						<CarouselNavigator
							currentIndex={currentIndex}
							totalItems={item.media.length < 8 ? item.media.length : 8}
							className="w-11/12 px-4"
						/>
					</View>
					<FlatList
						data={item.media.length > 8 ? item.media.slice(0, 8) : item.media}
						className="w-full h-full rounded-2xl"
						horizontal
						pagingEnabled
						bounces={false}
						showsHorizontalScrollIndicator={false}
						onViewableItemsChanged={({ viewableItems }) =>
							changeIndex(
								viewableItems as unknown as ViewToken<{
									image: number;
									title: string;
								}>[],
							)
						}
						renderItem={({ item: mediaItem }) => {
							return (
								<Pressable
									style={{ width: screenWidth }}
									className="h-full"
									onPress={() => {
										router.push({
											pathname: "/(vehicle)/[vehicleId]/gallery",
											params: { vehicleId: item.vehicle_id },
										});
									}}
								>
									<Image
										source={{ uri: formatPicturesUri("vehicles", mediaItem) }}
										className="w-full h-full "
										resizeMode="cover"
										style={{ width: screenWidth }}
										defaultSource={require("../../../../assets/images/vehicle-placeholder.webp")}
									/>
								</Pressable>
							);
						}}
						keyExtractor={(item) => item.toString()}
						onLayout={(event) => {
							setScreenWidth(event.nativeEvent.layout.width);
						}}
						snapToInterval={screenWidth}
						decelerationRate="fast"
					/>
					<LinearGradient
						colors={["transparent", "rgba(0,0,0,0.8)"]}
						className="absolute bottom-0 left-0 right-0 h-32 rounded-b-2xl"
					/>
				</Fragment>
			)}
			<View className="absolute bottom-4  right-4 w-full">
				{item.nickname && (
					<Text className="text-white font-semibold pl-8">{item.nickname}</Text>
				)}
				<Text className="text-white text-lg font-bold pl-8">
					{item.year} {item.brands?.name} {item.model}
				</Text>
				<View className="flex-row items-center justify-between w-full mt-4">
					<Pressable
						onPress={() => {
							const isCurrentUser = item.user_id === session?.user.id;
							if (!isCurrentUser) {
								router.push({
									pathname: "/(tabs)/user",
									params: {
										userId: item.user_id,
										previousScreen: `/(vehicle)/${item.vehicle_id}?previousScreen=${navigation.getState()?.routes[0].params?.previousScreen}`,
									},
								});
							}
						}}
						className="flex-row items-center pl-8"
					>
						{item.user_profiles?.profile_picture_url && (
							<Image
								source={{
									uri: formatPicturesUri(
										"profile_pictures",
										item.user_profiles.profile_picture_url,
									),
								}}
								className="w-6 h-6 rounded-full mr-2"
							/>
						)}
						<Text className="text-white text-sm font-semibold">
							{item.user_profiles?.pseudo || "Unknown User"}
						</Text>
					</Pressable>
					{actionButton || (
						<Link href={`/(create-vehicle)/${item.vehicle_id}/gallery`}>
							<View className="flex-row items-center pr-4 gap-0.5">
								<Ionicons name="grid-outline" size={16} color="white" />
								<Text className="text-white text-sm font-semibold">
									{item.media?.length ?? 0} photo
									{item.media?.length && item.media?.length > 1 ? "s" : ""}
								</Text>
								<Ionicons name="chevron-forward" size={16} color="white" />
							</View>
						</Link>
					)}
				</View>
			</View>
		</View>
	);
};
