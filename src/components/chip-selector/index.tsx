import { Chip } from "@/components/ui/chip";
import { SearchIcon } from "@/components/vectors/search";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
	type Control,
	type FieldValues,
	type Path,
	useController,
} from "react-hook-form";
import { FlatList, View } from "react-native";
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

	const TypeFilters = React.memo(() => (
		<FlatList
			data={types}
			contentContainerClassName="h-full flex flex-row flex-nowrap gap-3 mb-6"
			horizontal
			numColumns={1}
			renderItem={({ item }) => (
				<View key={item as string}>
					<Chip
						isFilter
						label={item.charAt(0).toUpperCase() + item.slice(1)}
						onPress={() => toggleType(item as string)}
						isSelected={selectedType === item.toLowerCase()}
					/>
				</View>
			)}
			keyExtractor={(item) => item as string}
		/>
	));

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

	const renderItem = useCallback(
		({ item }: { item: ItemType }) => (
			<Chip
				key={item.id}
				label={
					item.department_number
						? `${item.department_number} - ${item.name || "Unnamed department"}`
						: item.name
				}
				isSelected={(field.value || ([] as string[])).includes(item.id)}
				onPress={() => toggleItem(item.id)}
			/>
		),
		[field.value, toggleItem],
	);

	const flatListProps = {
		removeClippedSubviews: true,
		maxToRenderPerBatch: 10,
		windowSize: 5,
		initialNumToRender: 10,
		getItemLayout: (data, index) => ({
			length: 40, // Approximate height of each item
			offset: 40 * index,
			index,
		}),
	};

	if (items.length === 0) {
		return (
			<View className="flex-1">
				<SkeletonText />
			</View>
		);
	}

	return (
		<View className="flex-1">
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

			{items[0]?.type && <TypeFilters />}

			<FlatList
				data={filteredData}
				contentContainerClassName="flex flex-row flex-wrap gap-2 pb-4"
				numColumns={1}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				{...flatListProps}
			/>
		</View>
	);
};
