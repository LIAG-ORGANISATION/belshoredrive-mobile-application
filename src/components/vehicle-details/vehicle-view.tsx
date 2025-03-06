import { useFetchVehicleById, useVehicleComments } from "@/network/vehicles";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { Drawer } from "../ui/drawer";
import { DrawerSkeleton } from "../ui/drawer/skeleton";
import { Tabs } from "../ui/tabs";
import { VehicleCardFullInfos } from "../ui/vehicle-card/full-infos";
import { BrakeIcon } from "../vectors/brake-icon";
import { ChassisIcon } from "../vectors/chassis-icon";
import { EngineIcon } from "../vectors/engine-icon";
import { WheelIcon } from "../vectors/wheel-icon";
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
	const { data: comments } = useVehicleComments(vehicleId);
	const { initialTab } = useLocalSearchParams();

	if (!vehicle) return null;
	return (
		<View className="flex-1 flex flex-col bg-black">
			<ScrollView
				className={`flex-1 flex flex-col gap-4 bg-black mb-5  ${className}`}
				showsVerticalScrollIndicator={false}
			>
				<VehicleCardFullInfos item={vehicle} />
				<Tabs
					initialTab={Number(initialTab) || 0}
					tabs={[
						{
							content: (
								<View className="flex flex-col gap-4 h-full ">
									{isLoading ? (
										<DrawerSkeleton itemCount={4} />
									) : (
										<View className="flex flex-col gap-4 h-fit ">
											<VehicleDescriptionBox item={vehicle} />
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
									)}
								</View>
							),
							icon: <WheelIcon />,
							id: "vehicles",
						},
						{
							content: (
								<View className="flex-1 bg-black items-center justify-center">
									<Text className="text-gray-400 text-2xl font-bold">
										Commentaires
									</Text>
									<Text className="text-gray-400 text-lg text-center">
										Les commentaires ne sont pas encore disponibles au moment.
									</Text>
								</View>
							),
							icon: <Ionicons name="menu" size={24} color="white" />,
							id: "user-details",
						},
						{
							content: (
								<View className="flex-1 bg-black items-center justify-center">
									<Text className="text-gray-400 text-2xl font-bold">
										Commentaires
									</Text>
									<Text className="text-gray-400 text-lg text-center">
										Les commentaires ne sont pas encore disponibles au moment.
									</Text>
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
		</View>
	);
};
