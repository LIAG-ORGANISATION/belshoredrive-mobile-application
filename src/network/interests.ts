import { QueryKeys } from "@/lib/query-keys";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useFetchInterests = () => {
	return useQuery({
		queryKey: QueryKeys.INTERESTS,
		queryFn: () => fetchInterests(),
	});
};

export const useFetchUserInterests = ({
	ids,
	enabled,
}: { ids: string[] | undefined; enabled: boolean }) => {
	return useQuery({
		queryKey: QueryKeys.USER_INTERESTS,
		queryFn: () => fetchUserInterests(ids ?? []),
		enabled,
	});
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
