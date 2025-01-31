import { useFetchServices } from "@/network/services";
import { Text, View } from "react-native";

export default function Onboarding() {
  const { data: services = [], isLoading, error } = useFetchServices();

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      <Text>Available Services:</Text>

      {services.map((service: { name: string | null; service_id: string }) => (
        <Text key={service.service_id}>
          {service.name || "Unnamed service"}
        </Text>
      ))}
    </View>
  );
}