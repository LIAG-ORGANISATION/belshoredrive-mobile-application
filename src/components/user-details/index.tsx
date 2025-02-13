import { useFetchUserDepartments } from "@/network/departments";
import { useFetchUserInterests } from "@/network/interests";
import { useFetchUserServices } from "@/network/services";
import { useFetchUserProfileById } from "@/network/user-profile";
import dayjs from "dayjs";
import { Text, View } from "react-native";
import { Chip } from "../ui/chip";

export const UserDetails = ({ userId }: { userId: string }) => {
  const { data: user } = useFetchUserProfileById(userId);
  const { data: interests } = useFetchUserInterests(
    user?.interests as string[],
  );
  const { data: departments } = useFetchUserDepartments(
    user?.viewable_departments as string[],
  );
  const { data: services } = useFetchUserServices(user?.services as string[]);

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
          {services?.map((service) => (
            <Chip
              key={service.service_id}
              label={service.name}
              isSelected={false}
              onPress={() => {}}
            />
          ))}
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
        </View>
      </View>
    </View>
  );
};
