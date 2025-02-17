import { useFetchUserDepartments } from "@/network/departments";
import { useFetchUserInterests } from "@/network/interests";
import { useFetchUserServices } from "@/network/services";
import { useFetchUserProfileById } from "@/network/user-profile";
import dayjs from "dayjs";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { v4 as uuidv4 } from 'uuid';
import { Chip } from "../ui/chip";
import { SkeletonChip } from "../ui/skeleton-chip";
import { SkeletonText } from "../ui/skeleton-text";
export const UserDetails = ({ userId }: { userId: string }) => {
  const { data: user, isLoading: loadingUser } = useFetchUserProfileById(userId);

  const { data: interests, isLoading: loadingInterests } = useFetchUserInterests(
    user?.interests ?? [],
  );

  const { data: departments, isLoading: loadingDepartments } = useFetchUserDepartments(
    user?.viewable_departments ?? [],
  );

  const { data: services, isLoading: loadingServices } = useFetchUserServices(
    user?.services ?? [],
  );

  const isDataLoading = loadingUser ||
    (!!user && (loadingInterests || loadingDepartments || loadingServices));

  const renderAddChip = ({ onPress }: { onPress: () => void }) => {
    return (
      <Pressable className="border leading-5 border-[#545454] px-3 py-1 rounded-md bg-[#222]" onPress={onPress}>
        <Text className="text-white ">+ Ajouter</Text>
      </Pressable>
    );
  };

  const renderSkeletonChips = ({ count }: { count: number }) => (
    <View className="flex-row flex-wrap gap-2 mt-4">
      {Array(count).fill(null).map((_, index) => (
        <SkeletonChip key={uuidv4()} />
      ))}
    </View>
  );

  if (isDataLoading) {
    return (
      <View className="flex flex-col gap-4 h-full pb-10">
        <View className="flex flex-row gap-2">
          <View className="flex-1 flex flex-col gap-2">
            <SkeletonText width="w-16" />
            <SkeletonText width="w-24" />
          </View>
          <View className="flex-1 flex flex-col gap-2">
            <SkeletonText width="w-32" />
            <SkeletonText width="w-40" />
          </View>
        </View>

        {/* Services Section */}
        <View className="flex-col w-full gap-1">
          <SkeletonText width="w-48" />
          {renderSkeletonChips({ count: 3 })}
        </View>

        {/* Interests Section */}
        <View className="flex-col w-full gap-1">
          <SkeletonText width="w-40" />
          {renderSkeletonChips({ count: 3 })}
        </View>

        {/* Location Section */}
        <View className="flex-col w-full gap-1">
          <SkeletonText width="w-32" />
          {renderSkeletonChips({ count: 2 })}
        </View>
      </View>
    );
  }

  const renderChip = ({ item, onPress = () => {} }) => (
    <Chip
      key={uuidv4()}
      label={item.name}
      isSelected={false}
      onPress={onPress}
    />
  );

  const renderChips = (items: any[], keyExtractor: (item: any) => string, onAddPress: () => void) => (
    <View className="flex-row flex-wrap gap-2">
      {items?.map((item) => renderChip({ item }))}
      {renderAddChip({ onPress: onAddPress })}
    </View>
  );

  return (
    <View className="flex flex-col gap-4 h-full pb-10">
      <View className="flex flex-row gap-2">
        <View className="flex-1 flex flex-col gap-2">
          <Text className="text-sm text-gray-500 font-semibold">AGE</Text>
          <Text className="text-lg font-bold text-white ">
            {new Date().getFullYear() - (user?.birth_year ?? 0)} ans
          </Text>
        </View>
        <View className="flex-1 flex flex-col gap-2">
          <Text className="text-sm text-gray-500 font-semibold">
            INSCRIT DEPUIS
          </Text>
          <Text className="text-lg font-bold text-white ">
            {user?.created_at
              ? dayjs(user.created_at).format("DD MMMM YYYY")
              : ""}
          </Text>
        </View>
      </View>

      <View className="flex-col w-full gap-1">
        <Text className="text-white/70 text-lg font-semibold my-4">
          COMPÉTENCES & SERVICES
        </Text>
        {renderChips(
          services || [],
          (item) => item.service_id,
          () => router.push("/update-services")
        )}
      </View>

      <View className="flex-col w-full gap-1">
        <Text className="text-white/70 text-lg font-semibold my-4">
          CENTRES D'INTÉRÊTS
        </Text>
        {renderChips(
          interests || [],
          (item) => item.interest_id,
          () => router.push("/update-interests")
        )}
      </View>

      <View className="flex-col w-full gap-1">
        <Text className="text-white/70 text-lg font-semibold my-4">
          LOCALISATION
        </Text>
        {renderChips(
          departments || [],
          (item) => item.department_id,
          () => router.push("/update-departments")
        )}
      </View>
    </View>
  );
};
