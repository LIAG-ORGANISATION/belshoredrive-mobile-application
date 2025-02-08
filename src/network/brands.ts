import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useFetchBrands = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["brands"],
    queryFn: () => fetchBrands(),
  });

  return { data, isLoading, error };
};

export type BrandsType = {
  brand_id: string;
  name: string;
  type: string;
};

const fetchBrands = async (): Promise<BrandsType[]> => {
  const { data, error } = await supabase.from("brands").select("*");

  if (error) throw error;

  return data;
};
