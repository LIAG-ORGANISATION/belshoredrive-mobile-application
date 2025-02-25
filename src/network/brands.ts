import { QueryKeys } from "@/lib/query-keys";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useGetSession } from "./session";

export const useFetchBrands = () => {
	const { data: session } = useGetSession();
	return useQuery({
		queryKey: QueryKeys.BRANDS,
		queryFn: () => fetchBrands(),
		enabled: !!session,
	});
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
