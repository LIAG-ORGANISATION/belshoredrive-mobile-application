import { Chip } from "@/components/ui/chip";
import { SearchIcon } from "@/components/vectors/search";
import { FlashList, MasonryFlashList, } from "@shopify/flash-list";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	type Control,
	type FieldValues,
	type Path,
	useController,
} from "react-hook-form";
import { View } from "react-native";
import { SkeletonText } from "../ui/skeleton-text";
import { Input } from "../ui/text-input";
type DefaultItemType = {
	id: string;
	department_number?: string;
	name: string;
	type?: string;
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
}: ChipSelectorProps<T, ItemType>) => {
	const { field } = useController<T>({
		name,
		control,
	});

	const [types, setTypes] = useState<string[]>([]);
	const [selectedType, setSelectedType] = useState("all");
	const [itemsByType, setItemsByType] = useState<Record<string, ItemType[]>>(
		{},
	);
	const [searchQuery, setSearchQuery] = useState("");

	const toggleItem = useCallback(
		(itemId: string) => {
			const currentSelection = field.value || ([] as string[]);
			const newSelection =
				selectingType === "multiple"
					? currentSelection.includes(itemId)
						? currentSelection.filter((id: string) => id !== itemId)
						: [...currentSelection, itemId]
					: itemId;

			field.onChange(newSelection);
		},
		[field],
	);

	const toggleType = useCallback((type: string) => {
		setSelectedType(type.toLowerCase());
	}, []);

	useEffect(() => {
		const typeMap: Record<string, ItemType[]> = {};

		for (const item of items) {
			if (item.type) {
				if (!typeMap[item.type]) {
					typeMap[item.type] = [];
				}
				typeMap[item.type].push(item);
			}
		}
		setItemsByType({ ...typeMap, all: items });

		setTypes([
			"all",
			...Object.keys(typeMap).map(
				(type) => type.charAt(0).toUpperCase() + type.slice(1),
			),
		]);
	}, [items]);

	const filterItems = useCallback(
		(itemsToFilter: ItemType[] | undefined) => {
			if (!itemsToFilter) return itemsByType[selectedType];

			return itemsToFilter.filter(
				(item) =>
					item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					(item.department_number?.toLowerCase() || "").includes(
						searchQuery.toLowerCase(),
					),
			);
		},
		[itemsByType, selectedType, searchQuery],
	);

	const filteredData = useMemo(
		() => filterItems(items[0]?.type ? itemsByType[selectedType] : items),
		[items, itemsByType, selectedType, filterItems],
	);

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
				<Input
					name="search"
					classes="mb-4 !h-12"
					placeholder="Search..."
					value={searchQuery}
					onChangeText={setSearchQuery}
					icon={<SearchIcon />}
				/>
			)}

			{items[0]?.type && (
				<View className="flex flex-row flex-wrap gap-2 pb-4">
					<FlashList
						data={types}
						horizontal
						estimatedItemSize={100}
						renderItem={({ item }) => (
							<View className="mx-1">
								<Chip
									isFilter
									label={item.charAt(0).toUpperCase() + item.slice(1)}
									onPress={() => toggleType(item as string)}
									isSelected={selectedType === item.toLowerCase()}
								/>
							</View>
						)}
					/>
				</View>
			)}

			<MasonryFlashList
				data={filteredData}
				numColumns={3}
				contentContainerClassName="flex flex-row flex-wrap gap-2 pb-4"
				estimatedItemSize={40}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
			/>

		</View>
	);
};
