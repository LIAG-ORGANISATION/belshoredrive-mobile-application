import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useFetchInterests = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["interests"],
    queryFn: () => fetchInterests(),
  });

  return { data, isLoading, error };
};

export type InterestsType = {
  interest_id: string;
  name: string;
};

const fetchInterests = async (): Promise<InterestsType[]> => {
  const { data, error } = await supabase.from("interests").select("*");

  if (error) throw error;

  return data;
};
