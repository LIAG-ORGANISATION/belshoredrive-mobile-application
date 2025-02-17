import { useFetchUserDepartments } from "@/network/departments";
import { useFetchUserInterests } from "@/network/interests";
import { useFetchUserServices } from "@/network/services";
import { useFetchUserProfileById } from "@/network/user-profile";
import dayjs from "dayjs";
import { Link, router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Chip } from "../ui/chip";
import { SkeletonChip } from "../ui/skeleton-chip";
import { SkeletonText } from "../ui/skeleton-text";

export const UserDetails = ({ userId }: { userId: string }) => {
  const { data: user, isLoading: loadingUser } = useFetchUserProfileById(userId);
  const { data: interests, isLoading: loadingInterests } = useFetchUserInterests(
    user?.interests as string[],
  );
  const { data: departments, isLoading: loadingDepartments } = useFetchUserDepartments(
    user?.viewable_departments as string[],
  );
  const { data: services, isLoading: loadingServices } = useFetchUserServices(
    user?.services as string[],
  );

  const isLoading = loadingUser || loadingInterests || loadingDepartments || loadingServices;

  const renderAddChip = ({ onPress }: { onPress: () => void }) => {
    return (
      <Pressable className="border leading-5 border-[#545454] px-3 py-1 rounded-md bg-[#222]" onPress={onPress}>
        <Text className="text-white ">+ Ajouter</Text>
      </Pressable>
    );
  };

  if (isLoading) {
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
          <View className="flex-row flex-wrap gap-2 mt-4">
            {[1, 2, 3].map((i) => (
              <SkeletonChip key={i} />
            ))}
          </View>
        </View>

        {/* Interests Section */}
        <View className="flex-col w-full gap-1">
          <SkeletonText width="w-40" />
          <View className="flex-row flex-wrap gap-2 mt-4">
            {[1, 2, 3].map((i) => (
              <SkeletonChip key={i} />
            ))}
          </View>
        </View>

        {/* Location Section */}
        <View className="flex-col w-full gap-1">
          <SkeletonText width="w-32" />
          <View className="flex-row flex-wrap gap-2 mt-4">
            {[1, 2].map((i) => (
              <SkeletonChip key={i} />
            ))}
          </View>
        </View>
      </View>
    );
  }

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

      <View className="flex-col w-full gap-1 ">
        <Text className="text-white/70 text-lg font-semibold my-4">
          COMPÉTENCES & SERVICES
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {services?.length === 0 && (
            <Text className="text-white/70 text-sm font-semibold">
              <Link href="/complete-profile/services">
                <Text className="text-blue-500">Compléter mes services</Text>
              </Link>
            </Text>
          )}
          {services?.map((service) => (
            <Chip
              key={service.service_id}
              label={service.name}
              isSelected={false}
              onPress={() => {}}
            />
          ))}
          {renderAddChip({ onPress: () => {
            // TODO: Create new view for adding services on profile service with back button
            router.push("/complete-profile/services");
          } })}
        </View>
      </View>
      <View className="flex-col w-full gap-1 ">
        <Text className="text-white/70 text-lg font-semibold my-4">
          CENTRES D'INTÉRÊTS
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {interests?.map((interest) => (
            <Chip
              key={interest.interest_id}
              label={interest.name}
              isSelected={false}
              onPress={() => {}}
            />
          ))}
          {renderAddChip({ onPress: () => {
            // TODO: Create new view for adding interests on profile interests with back button
          } })}
        </View>
      </View>
      <View className="flex-col w-full gap-1 ">
        <Text className="text-white/70 text-lg font-semibold my-4">
          LOCALISATION
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {departments?.map((department) => (
            <Chip
              key={department.department_id}
              label={department.name}
              isSelected={false}
              onPress={() => {}}
            />
          ))}
          {renderAddChip({ onPress: () => {
            // TODO: Create new view for adding departments on profile departments with back button
          } })}
        </View>
      </View>
    </View>
  );
};
