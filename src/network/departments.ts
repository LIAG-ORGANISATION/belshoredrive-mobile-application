import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useFetchDepartments = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["departments"],
    queryFn: () => fetchDepartments(),
  });

  return { data, isLoading, error };
};

const fetchDepartments = async () => {
  const { data, error } = await supabase.from("departments").select("*");

  if (error) throw error;

  return data;
};
