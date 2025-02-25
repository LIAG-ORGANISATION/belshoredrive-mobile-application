import { QueryKeys } from "@/lib/query-keys";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useFetchDepartments = () => {
	return useQuery({
		queryKey: QueryKeys.DEPARTMENTS,
		queryFn: () => fetchDepartments(),
	});
};

export const useFetchUserDepartments = ({
	ids,
	enabled,
}: { ids: string[] | undefined; enabled: boolean }) => {
	return useQuery({
		queryKey: QueryKeys.USER_DEPARTMENTS,
		queryFn: () => fetchUserDepartments(ids ?? []),
		enabled,
	});
};

export type DepartmentType = {
	department_id: string;
	department_number: string;
	name: string;
};

const fetchDepartments = async (): Promise<DepartmentType[]> => {
	const { data, error } = await supabase.from("departments").select("*");

	if (error) throw error;

	return data;
};

const fetchUserDepartments = async (
	ids: string[],
): Promise<DepartmentType[]> => {
	const { data, error } = await supabase
		.from("departments")
		.select("*")
		.in("department_id", ids);

	if (error) throw error;

	return data;
};
