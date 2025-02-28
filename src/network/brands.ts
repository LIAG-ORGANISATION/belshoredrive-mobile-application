import { QueryKeys } from "@/lib/query-keys";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useFetchBrands = (type_id?: string) => {
	return useQuery({
		queryKey: [QueryKeys.BRANDS, type_id],
		queryFn: () => fetchBrands(type_id),
		enabled: !!type_id,
	});
};

export type BrandsType = {
	brand_id: string;
	name: string;
	type: string;
};

const fetchBrands = async (type_id?: string): Promise<BrandsType[]> => {
	if (!type_id) {
		const { data, error } = await supabase.from("brands").select("*");

		if (error) {
			console.error("error --------> ", error);
			throw error;
		}

		return data;
	}

	const { data, error } = await supabase
		.from("brands")
		.select("*")
		.eq("type_id", type_id);

	if (error) {
		console.error("error --------> ", error);
		throw error;
	}

	return data;
};
