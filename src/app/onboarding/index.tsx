import { Button } from "@/components/ui/button";
import { useFetchDepartments } from "@/network/departments";
import { useFetchUserProfile, useUpdateUserProfile } from "@/network/user-profile";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

export default function Onboarding() {
  const { data: departments = [], isLoading: loadingDepts, error: deptsError } = useFetchDepartments();
  const { data: profile, isLoading: loadingProfile } = useFetchUserProfile();
  const { mutate: updateProfile } = useUpdateUserProfile();
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  // Initialize selected departments from profile
  useEffect(() => {
    if (profile?.viewable_departments) {
      setSelectedDepartments(profile.viewable_departments);
    }
  }, [profile]);

  // Handle department selection
  const toggleDepartment = async (departmentId: string) => {
    const newSelection = selectedDepartments.includes(departmentId)
      ? selectedDepartments.filter(id => id !== departmentId)
      : [...selectedDepartments, departmentId];

    setSelectedDepartments(newSelection);

    try {
      await updateProfile({ viewable_departments: newSelection });
    } catch (error) {
      // Revert selection if update fails
      setSelectedDepartments(selectedDepartments);
      console.error('Failed to update viewable departments:', error);
    }
  };

  if (loadingDepts || loadingProfile) return <Text>Loading...</Text>;
  if (deptsError) return <Text>Error: {deptsError.message}</Text>;

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1">
        <Text className="text-white text-2xl font-bold p-4">Dans quelle(s) région(s) peut-on vous croiser ? </Text>

        <FlatList
          data={departments}
          columnWrapperClassName="flex flex-wrap gap-2 mb-2"
          numColumns={3}
          renderItem={({ item: department }) => (
            <Pressable
              key={department.department_id}
              onPress={() => toggleDepartment(department.department_id)}
            >
              <Text
                className={`text-sm border border-white p-1 px-2 rounded-md ${
                  selectedDepartments.includes(department.department_id) 
                    ? "bg-white text-black" 
                    : "bg-gray-900 text-white"
                }`}
              >
                {department.department_number} - {department.name || "Unnamed department"}
              </Text>
            </Pressable>
          )}
          keyExtractor={(department) => department.department_id}
        />
      </View>

      <View className="absolute bottom-0 w-full px-4 pb-10 pt-4 bg-black z-10">
        <Button
          variant="secondary"
          label="Continuer" 
          disabled={selectedDepartments.length === 0}
          onPress={() => router.push("/onboarding/brands")}
        />
      </View>
    </View>
  );
}