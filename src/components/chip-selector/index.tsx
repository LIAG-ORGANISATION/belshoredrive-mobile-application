import { Chip } from "@/components/ui/chip";
import { SearchIcon } from "@/components/vectors/search";
import { useEffect, useState } from "react";
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from "react-hook-form";
import { FlatList, Text, View } from "react-native";
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
};

export const ChipSelector = <
  T extends FieldValues,
  ItemType extends DefaultItemType,
>({
  name,
  control,
  items,
  haveSearch = false,
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

  const toggleItem = (itemId: string) => {
    const currentSelection = field.value || ([] as string[]);
    const newSelection = currentSelection.includes(itemId)
      ? currentSelection.filter((id: string) => id !== itemId)
      : [...currentSelection, itemId];

    field.onChange(newSelection);
  };

  const toggleType = (type: string) => {
    setSelectedType(type.toLowerCase());
  };

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

  const TypeFilters = () => (
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
  );

  const filterItems = (itemsToFilter: ItemType[] | undefined) => {
    if (!itemsToFilter) return itemsByType[selectedType];
    return itemsToFilter.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.department_number?.toLowerCase() || "").includes(
          searchQuery.toLowerCase(),
        ),
    );
  };

  return (
    <View className="pb-safe-offset-0 h-full">
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
      {items[0].type && <TypeFilters />}
      <FlatList
        data={filterItems(items[0].type ? itemsByType[selectedType] : items)}
        contentContainerClassName="flex flex-row flex-wrap gap-2"
        numColumns={1}
        renderItem={({ item }) => (
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
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
