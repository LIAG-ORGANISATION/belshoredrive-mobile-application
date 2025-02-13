import { useFetchUserDepartments } from "@/network/departments";
import { useFetchUserInterests } from "@/network/interests";
import { useFetchUserServices } from "@/network/services";
import { useFetchUserProfileById } from "@/network/user-profile";
import { Text, View } from "react-native";

export const UserDetails = ({ userId }: { userId: string }) => {
  const { data: user } = useFetchUserProfileById(userId);
  const { data: interests } = useFetchUserInterests(
    user?.interests as string[],
  );
  const { data: departments } = useFetchUserDepartments(
    user?.viewable_departments as string[],
  );
  const { data: services } = useFetchUserServices(user?.services as string[]);
  console.log(user);
  return (
    <View>
      <Text>User Details</Text>
      <Text>{user?.pseudo}</Text>
      {/* <Text>{user?.email}</Text>
      <Text>{user?.phone}</Text>
      <Text>{user?.address}</Text>
      <Text>{user?.city}</Text>
      <Text>{user?.zip_code}</Text> */}
    </View>
  );
};
