import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useFetchInterests = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["interests"],
    queryFn: () => fetchInterests(),
  });

  return { data, isLoading, error };
};

export const useFetchUserInterests = (ids: string[]) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userInterests"],
    queryFn: () => fetchUserInterests(ids),
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

const fetchUserInterests = async (ids: string[]): Promise<InterestsType[]> => {
  const { data, error } = await supabase
    .from("interests")
    .select("*")
    .in("interest_id", ids);

  if (error) throw error;

  return data;
};
