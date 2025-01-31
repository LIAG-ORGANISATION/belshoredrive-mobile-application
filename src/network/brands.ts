import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useFetchBrands = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["brands"],
    queryFn: () => fetchBrands(),
  });

  return { data, isLoading, error };
};

const fetchBrands = async () => {
  const { data, error } = await supabase.from("brands").select("*");

  if (error) throw error;

  return data;
};
