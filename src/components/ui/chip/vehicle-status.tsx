import { useEffect, useState } from "react";
import { type ColorValue, Text } from "react-native";

interface ChipProps {
	label: string;
}

const vehicleStatus: { label: string; color: ColorValue }[] = [
	{
		label: "Insdisponible",
		color: "#F44336",
	},
	{
		label: "Disponible",
		color: "#4CAF50",
	},
	{
		label: "En préparation",
		color: "#0E57C1",
	},
	{
		label: "Réservé",
		color: "#FFA000",
	},
	{
		label: "Vendu",
		color: "#545454",
	},
];

export function VehicleStatusChip({ label }: ChipProps) {
	const [statusColor, setStatusColor] = useState<ColorValue | null>(null);
	const refactoredLabel = label.toUpperCase();

	useEffect(() => {
		if (!refactoredLabel) return;
		const color = vehicleStatus.find((status) => {
			return status.label === label;
		})?.color;
		setStatusColor(color ?? "#0E57C1");
	}, [refactoredLabel]);

	if (!statusColor) return null;

	return (
		<Text
			className={`w-fit px-4 py-1 rounded-full text-sm text-white font-semibold`}
			style={{ backgroundColor: statusColor }}
		>
			{refactoredLabel}
		</Text>
	);
}
