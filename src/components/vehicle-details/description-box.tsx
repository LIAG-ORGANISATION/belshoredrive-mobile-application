import { IconCalendar } from "@/components/vectors/icon-calendar";
import { useFetchVehicleTagsDetails } from "@/network/vehicles";
import type { Tables } from "@/types/supabase";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { Chip } from "../ui/chip/index";
import { VehicleStatusChip } from "../ui/chip/vehicle-status";
import { SkeletonChip } from "../ui/skeleton-chip";
import { BorneIcon } from "../vectors/borne-icon";
import { BrandTag } from "../vectors/brand-tag";
import { GearIcon } from "../vectors/gear-icon";
import { WheelIcon } from "../vectors/wheel-icon";
interface ChipProps {
	item: {
		name: string;
		interest_id?: string;
	};
	onPress?: () => void;
}
export function VehicleDescriptionBox({
	item,
}: { item: Tables<"vehicles"> & { brands: Tables<"brands"> } }) {
	const { data: tagsDetails, isLoading: isLoadingTagsDetails } =
		useFetchVehicleTagsDetails(item.tags ?? []);

	const renderSkeletonChips = ({ count }: { count: number }) => (
		<View className="flex-row flex-wrap gap-2 mt-4">
			{Array(count)
				.fill(null)
				.map((_, index) => (
					<SkeletonChip key={uuidv4()} />
				))}
		</View>
	);

	const renderChip = ({ item, onPress = () => {} }: ChipProps) => (
		<Chip
			key={uuidv4()}
			label={item.name}
			isSelected={false}
			onPress={onPress}
		/>
	);
	const renderChips = (
		items: { name: string; tag_id?: string }[],
		keyExtractor: (item: { name: string; tag_id?: string }) => string,
	) => (
		<View className="flex-row flex-wrap gap-2">
			{items?.map((item) => renderChip({ item }))}
		</View>
	);

	const renderBrandDetails = (
		icon: React.ReactNode,
		label: string,
		value: string,
	) => (
		<View
			className="flex-row items-center gap-3 w-1/2 py-3"
			style={{ flex: 1, flexBasis: "48%" }}
		>
			{icon}
			<View>
				<Text className="text-neutral-500 text-sm font-semibold">{label}</Text>
				<Text className="text-white text-base font-semibold">{value}</Text>
			</View>
		</View>
	);
	return (
		<View className="flex flex-col rounded-lg border-2 border-white/20">
			<View className="flex-row items-center justify-between p-4 border-b-2 border-white/20">
				<Text className="text-white text-lg font-bold">Description</Text>
			</View>
			<View className="flex flex-col gap-2 p-4">
				<View className="flex-row items-center">
					<VehicleStatusChip label={item.vehicle_statuses?.name ?? ""} />
				</View>
				<View className="flex-row items-center">
					<Text className="text-white text-base font-semibold">
						{item.description}
					</Text>
				</View>
				<View className="flex-row items-center">
					<Text className="text-neutral-500 text-sm font-semibold">Tags</Text>
				</View>
				<View className="flex-row items-center">
					{isLoadingTagsDetails
						? renderSkeletonChips({ count: 3 })
						: renderChips(tagsDetails || [], (item) => item.tag_id ?? "")}
				</View>

				<View className="flex-row flex-wrap justify-between gap-2">
					{renderBrandDetails(<BrandTag />, "MARQUE", item.brands?.name ?? "")}
					{renderBrandDetails(<WheelIcon />, "MODELE", item.model ?? "")}
					{renderBrandDetails(
						<IconCalendar color="white" fill="#545454" />,
						"ANNEE",
						String(item.year ?? ""),
					)}
					{renderBrandDetails(
						<BorneIcon />,
						"BORNE",
						item.mileage?.toString() ?? "",
					)}
					{renderBrandDetails(
						<GearIcon />,
						"BOITE",
						item.power?.toString() ?? "",
					)}
					{renderBrandDetails(
						<Ionicons name="speedometer-outline" size={24} color="#545454" />,
						"VITESSE MAX",
						String(item.max_speed ?? ""),
					)}
					{renderBrandDetails(
						<Ionicons name="speedometer-outline" size={24} color="#545454" />,
						"TRANSMISSION",
						String(item.transmission_types?.name ?? ""),
					)}
					{renderBrandDetails(
						<Ionicons name="speedometer-outline" size={24} color="#545454" />,
						"MOTORISATION",
						String(item.motorization_types?.name ?? ""),
					)}
					{renderBrandDetails(
						<Ionicons name="speedometer-outline" size={24} color="#545454" />,
						"CONDUITE",
						String(item.driving_side === "left" ? "A gauche" : "A droite"),
					)}
					{renderBrandDetails(
						<Ionicons name="speedometer-outline" size={24} color="#545454" />,
						"DATE D'ACHAT",
						String(item.purchase_date ?? ""),
					)}
				</View>
			</View>
		</View>
	);
}
