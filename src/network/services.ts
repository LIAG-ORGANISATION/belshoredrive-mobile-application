import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useGetSession } from "./session";

export const useFetchServices = () => {
  const { data: session } = useGetSession();
  const { data, isLoading, error } = useQuery({
    queryKey: ["services"],
    queryFn: () => fetchServices(),
    enabled: !!session,
  });

  return { data, isLoading, error };
};

export const useFetchUserServices = (ids: string[]) => {
  const { data: session } = useGetSession();
  const { data, isLoading, error } = useQuery({
    queryKey: ["userServices"],
    queryFn: () => fetchUserServices(ids),
    enabled: !!session,
  });

  return { data, isLoading, error };
};
export type ServicesType = {
  service_id: string;
  name: string;
};

const fetchServices = async (): Promise<ServicesType[]> => {
  const { data, error } = await supabase.from("services").select("*");

  if (error) throw error;

  return data;
};

const fetchUserServices = async (ids: string[]): Promise<ServicesType[]> => {
  const { data, error } = await supabase
    .from("services ")
    .select("*")
    .in("service_id", ids);

  if (error) throw error;

  return data;
};
