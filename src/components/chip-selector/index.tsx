import { Chip } from "@/components/ui/chip";
import { SearchIcon } from "@/components/vectors/search";
import { MasonryFlashList } from "@shopify/flash-list";
import { useState } from "react";
import {
	type Control,
	type FieldValues,
	type Path,
	useController,
} from "react-hook-form";
import { View } from "react-native";
import { SkeletonText } from "../ui/skeleton-text";
import { Input } from "../ui/text-input";
import { TypesSelector } from "./types-selector";

type DefaultItemType = {
	id: string;
	department_number?: string;
	name: string;
};

type ChipSelectorProps<
	T extends FieldValues,
	ItemType extends DefaultItemType,
> = {
	name: Path<T>;
	control: Control<T>;
	items: ItemType[];
	haveSearch?: boolean;
	selectingType?: "multiple" | "single";
	types?: { label: string; id: string }[];
	toggleType?: (type: string) => void;
	selectedVehicleType?: string;
};

export const ChipSelector = <
	T extends FieldValues,
	ItemType extends DefaultItemType,
>({
	name,
	control,
	items,
	haveSearch = false,
	selectingType = "multiple",
	types,
	selectedVehicleType,
	toggleType,
}: ChipSelectorProps<T, ItemType>) => {
	const { field } = useController<T>({
		name,
		control,
	});
	const [searchQuery, setSearchQuery] = useState("");

	const toggleItem = (itemId: string) => {
		const currentSelection = field.value || ([] as string[]);
		const newSelection =
			selectingType === "multiple"
				? currentSelection.includes(itemId)
					? currentSelection.filter((id: string) => id !== itemId)
					: [...currentSelection, itemId]
				: itemId;

		field.onChange(newSelection);
	};

	const renderItem = ({ item }: { item: ItemType }) => (
		<View className="mb-2 mx-1">
			<Chip
				label={
					item.department_number
						? `${item.department_number} - ${item.name || "Unnamed department"}`
						: item.name
				}
				isSelected={(field.value || ([] as string[])).includes(item.id)}
				onPress={() => toggleItem(item.id)}
			/>
		</View>
	);

	if (items.length === 0) {
		return (
			<View className="flex-1">
				<SkeletonText />
			</View>
		);
	}

	return (
		<View className="flex-1 w-full">
			{haveSearch && (
				<View className="mb-4">
					<Input
						name="search"
						classes="!h-12"
						placeholder="Search..."
						value={searchQuery}
						onChangeText={setSearchQuery}
						icon={<SearchIcon />}
					/>
				</View>
			)}

			{types && types.length > 1 && toggleType && (
				<TypesSelector
					types={types}
					selectedType={selectedVehicleType ?? ""}
					toggleTypes={toggleType}
				/>
			)}

			<MasonryFlashList
				data={items}
				numColumns={3}
				contentContainerClassName="flex flex-row flex-wrap gap-2 pb-4"
				estimatedItemSize={40}
				renderItem={renderItem}
				extraData={field.value}
			/>
		</View>
	);
};
