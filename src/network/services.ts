import { QueryKeys } from "@/lib/query-keys";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useFetchServices = () => {
	return useQuery({
		queryKey: QueryKeys.SERVICES,
		queryFn: () => fetchServices(),
	});
};

export const useFetchUserServices = ({
	ids,
	enabled,
}: { ids: string[] | undefined; enabled: boolean }) => {
	return useQuery({
		queryKey: QueryKeys.USER_SERVICES,
		queryFn: () => fetchUserServices(ids ?? []),
		enabled,
	});
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
