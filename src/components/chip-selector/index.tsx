import { Chip } from "@/components/ui/chip";
import { useEffect, useState } from "react";
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from "react-hook-form";
import { FlatList, View } from "react-native";

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
};

export const ChipSelector = <
  T extends FieldValues,
  ItemType extends DefaultItemType,
>({
  name,
  control,
  items,
}: ChipSelectorProps<T, ItemType>) => {
  const { field } = useController<T>({
    name,
    control,
  });

  const [types, setTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState("All");
  const [itemsByType, setItemsByType] = useState<Record<string, ItemType[]>>(
    {},
  );

  const toggleItem = (itemId: string) => {
    const currentSelection = field.value || ([] as string[]);
    const newSelection = currentSelection.includes(itemId)
      ? currentSelection.filter((id: string) => id !== itemId)
      : [...currentSelection, itemId];

    field.onChange(newSelection);
  };

  const toggleType = (type: string) => {
    setSelectedType(type);
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
    setItemsByType({ ...typeMap, All: items });
    setTypes([
      "All",
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
            label={item as string}
            onPress={() => toggleType(item as string)}
            isSelected={selectedType.includes(item as string)}
          />
        </View>
      )}
      keyExtractor={(item) => item as string}
    />
  );

  return (
    <View className="pb-safe-offset-0">
      {items[0].type && <TypeFilters />}
      <FlatList
        data={items[0].type ? itemsByType[selectedType] : items}
        contentContainerClassName="flex flex-row flex-wrap gap-2 mb-32"
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
