import { useFetchVehicleById, useUpdateVehicle } from "@/network/vehicles";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import { Button } from "../ui/button";
import { Drawer } from "../ui/drawer";
import { DrawerSkeleton } from "../ui/drawer/skeleton";
import { VehicleCardFullInfos } from "../ui/vehicle-card/full-infos";
import { BrakeIcon } from "../vectors/brake-icon";
import { ChassisIcon } from "../vectors/chassis-icon";
import { EngineIcon } from "../vectors/engine-icon";
import { WheelIcon } from "../vectors/wheel-icon";
import { VehicleDescriptionBox } from "./description-box";

export const VehicleViewEdit = ({
	vehicleId,
	className = "",
	onSuccess,
}: {
	vehicleId: string;
	className?: string;
	onSuccess: () => void;
}) => {
	const { data: vehicle, isLoading } = useFetchVehicleById(vehicleId, "full");
	const { mutate: mutateVehicle, isPending } = useUpdateVehicle();
	const publishVehicle = () => {
		mutateVehicle(
			{
				vehicleId,
				updates: {
					is_published: true,
				},
			},
			{
				onSuccess: () => {
					onSuccess();
				},
			},
		);
	};
	if (!vehicle) return null;
	return (
		<View className="flex-1 flex flex-col bg-black mb-10">
			<ScrollView
				className={`flex-1 flex flex-col gap-4 bg-black mb-5  ${className}`}
				showsVerticalScrollIndicator={false}
			>
				<VehicleCardFullInfos item={vehicle} />
				<VehicleDescriptionBox item={vehicle} />
				{isLoading ? (
					<DrawerSkeleton itemCount={4} />
				) : (
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
				)}
			</ScrollView>
			<View className="w-full">
				<Button
					className="w-full"
					variant="secondary"
					label="Publier"
					icon={
						<Ionicons
							name="paper-plane"
							size={24}
							style={{ color: "#4aa8ba", paddingRight: 10 }}
						/>
					}
					onPress={publishVehicle}
					disabled={isPending}
				/>
			</View>
		</View>
	);
};
