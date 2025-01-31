import { useFetchServices } from "@/network/services";
import { Text, View } from "react-native";

export default function Onboarding() {
  const { data: services = [], isLoading, error } = useFetchServices();

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View className="flex-1 bg-black">
      <Text>Available Services:</Text>
      <View className="flex-1 flex-row flex-wrap gap-2">
        {services.map((service: { name: string | null; service_id: string }) => (
          <Text key={service.service_id} className="text-white text-sm border border-white p-1 rounded-md bg-gray-900">
            {service.name || "Unnamed service"}
          </Text>
        ))}
      </View>
    </View>
  );
}