import { BottomSheetContent } from "@/components/ui/bottom-sheet";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { useCreateComment } from "@/network/comments";
import {
	useFetchVehicleById,
	useRateVehicle,
	useVehicleComments,
	useVehicleRating,
	useVehicleRatingByUser,
} from "@/network/vehicles";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Drawer } from "../ui/drawer";
import { DrawerSkeleton } from "../ui/drawer/skeleton";
import { RateVehicle } from "../ui/rate-vehicle";
import { Tabs } from "../ui/tabs";
import { VehicleCardFullInfos } from "../ui/vehicle-card/full-infos";
import { BrakeIcon } from "../vectors/brake-icon";
import { ChassisIcon } from "../vectors/chassis-icon";
import { DirectMessageIcon } from "../vectors/direct-message-icon";
import { EngineIcon } from "../vectors/engine-icon";
import { FireWheelIcon } from "../vectors/fire-wheel-icon";
import { WheelIcon } from "../vectors/wheel-icon";
import { Comments } from "./comments";
import { VehicleDescriptionBox } from "./description-box";

export const VehicleView = ({
	vehicleId,
	className = "",
}: {
	vehicleId: string;
	className?: string;
	onSuccess?: () => void;
}) => {
	const { data: vehicle, isLoading } = useFetchVehicleById(vehicleId, "full");
	const { data: rating } = useVehicleRating(vehicleId);
	const { mutate: rateVehicle } = useRateVehicle();
	const { data: ratingByUser } = useVehicleRatingByUser(vehicleId);
	const { data: comments } = useVehicleComments(vehicleId);
	const { mutate: createComment } = useCreateComment();
	const { initialTab } = useLocalSearchParams();
	const [activeTab, setActiveTab] = useState(Number(initialTab) || 0);
	const [message, setMessage] = useState("");
	const { registerSheet, showSheet, hideSheet } = useBottomSheet();
	const scrollViewRef = useRef<ScrollView>(null);

	const handleSend = () => {
		createComment(
			{
				vehicleId: vehicleId,
				content: message,
			},
			{
				onSuccess: () => {
					setMessage("");
				},
			},
		);
	};

	const handleOpenBottomSheet = useCallback(() => {
		showSheet("vehicleRating");
	}, [showSheet]);

	useLayoutEffect(() => {
		const ratingContent = (
			<BottomSheetContent>
				<RateVehicle
					initialRating={ratingByUser?.rating}
					onRatingChange={(rating) => {
						rateVehicle(
							{ vehicleId, rating },
							{
								onSuccess: () => {
									// Use hideSheet instead of ref.current.close()
									hideSheet("vehicleRating");
								},
							},
						);
					}}
				/>
			</BottomSheetContent>
		);

		registerSheet("vehicleRating", {
			id: "vehicleRating",
			component: ratingContent,
			snapPoints: ["40%"],
			enablePanDownToClose: true,
			backgroundStyle: { backgroundColor: "#1f1f1f" },
			handleIndicatorStyle: { backgroundColor: "#fff" },
		});
	}, [ratingByUser?.rating]);

	const scrollToBottom = () => {
		scrollViewRef.current?.scrollToEnd({ animated: true });
	};

	useEffect(() => {
		if (activeTab === 2) {
			scrollToBottom();
		}
	}, [comments?.data.length, activeTab]);

	if (!vehicle) return null;

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
			className="relative flex-1 flex flex-col bg-black"
		>
			<ScrollView
				ref={scrollViewRef}
				className={`flex-1 flex flex-col gap-4 bg-black ${className}`}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={{ paddingBottom: activeTab === 2 ? 80 : 20 }}
				onContentSizeChange={() => {
					if (activeTab === 2) {
						scrollToBottom();
					}
				}}
			>
				<VehicleCardFullInfos
					item={vehicle}
					actionButton={
						<TouchableOpacity
							className="px-3 py-2 flex flex-row items-center justify-center gap-2 bg-black/30 rounded-lg"
							onPress={handleOpenBottomSheet}
						>
							<FireWheelIcon />
							{rating?.count !== 0 && (
								<Text className="text-white text-lg">
									<Text className="font-bold">{rating?.average}</Text>
									&nbsp;sur 10
								</Text>
							)}
						</TouchableOpacity>
					}
				/>
				<Tabs
					initialTab={Number(initialTab) || 0}
					onChange={setActiveTab}
					tabs={[
						{
							content: (
								<View className="flex flex-col gap-4 h-full ">
									{isLoading ? (
										<DrawerSkeleton itemCount={4} />
									) : (
										<View className="flex flex-col gap-4 h-fit ">
											<VehicleDescriptionBox item={vehicle} />
										</View>
									)}
								</View>
							),
							icon: <WheelIcon />,
							id: "vehicles",
						},
						{
							content: (
								<View className="flex-1 bg-black items-center justify-center">
									<Drawer
										items={[
											{
												icon: <EngineIcon />,
												label: "Motorization",
												value: vehicle.motorization ?? "",
											},
											{
												icon: <ChassisIcon />,
												label: "Chassis",
												value: vehicle.chassis ?? "",
											},
											{
												icon: <BrakeIcon />,
												label: "Freinage",
												value: vehicle.braking ?? "",
											},
											{
												icon: <WheelIcon />,
												label: "Extérieur",
												value: vehicle.exterior ?? "",
											},
										]}
										className="rounded-lg border-2 border-white/20"
									/>
								</View>
							),
							icon: <Ionicons name="menu" size={24} color="white" />,
							id: "user-details",
						},
						{
							content: (
								<View className="flex-1 bg-black items-center justify-center">
									{comments && comments.data.length > 0 ? (
										<View className="flex-1 bg-black items-center justify-center w-full pb-16">
											<Comments comments={comments} />
										</View>
									) : (
										<Text className="text-gray-400 text-lg text-center">
											Aucun commentaire pour le moment, soyez le premier à
											commenter ce véhicule !
										</Text>
									)}
								</View>
							),
							icon: (
								<Ionicons name="chatbox-ellipses" size={24} color="black" />
							),
							id: "socials",
						},
					]}
				/>
			</ScrollView>
			{activeTab === 2 && (
				<View className="w-full bg-black border-t border-gray-800">
					<View className="px-4 pt-2 pb-10 flex flex-row items-center gap-2">
						<TextInput
							className="p-2 text-white flex-1"
							value={message}
							onChangeText={setMessage}
							placeholder="Ecrire un commentaire ..."
							placeholderTextColor="#666"
							onFocus={scrollToBottom}
							onSubmitEditing={handleSend}
							returnKeyType="send"
						/>
						<TouchableOpacity
							className="w-10 h-10 items-center justify-center disabled:opacity-50"
							disabled={message.length < 2}
							onPress={handleSend}
						>
							<DirectMessageIcon width={20} height={20} fill="#fff" />
						</TouchableOpacity>
					</View>
				</View>
			)}
		</KeyboardAvoidingView>
	);
};
