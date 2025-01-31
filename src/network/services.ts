import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/supabase";
import { useQuery } from "@tanstack/react-query";

const fetchServices = async () => {
  const { data, error } = await supabase.from("services").select("*");
  if (error) throw error;
  return data;
};

export function useFetchServices() {
  return useQuery<Tables<"services">[], Error>({
    queryKey: ["services"],
    queryFn: fetchServices,
  });
}
