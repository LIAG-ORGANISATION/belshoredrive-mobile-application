import { Chip } from "@/components/ui/chip";
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from "react-hook-form";
import { FlatList } from "react-native";

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

  const toggleItem = (itemId: string) => {
    const currentSelection = field.value || ([] as string[]);
    const newSelection = currentSelection.includes(itemId)
      ? currentSelection.filter((id: string) => id !== itemId)
      : [...currentSelection, itemId];

    field.onChange(newSelection);
  };

  return (
    <FlatList
      data={items}
      contentContainerClassName="flex flex-row flex-wrap gap-2 mb-10"
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
  );
};
