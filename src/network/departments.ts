import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useFetchDepartments = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ["departments"],
		queryFn: () => fetchDepartments(),
	});

	return { data, isLoading, error };
};

export const useFetchUserDepartments = ({
	ids,
	enabled,
}: { ids: string[] | undefined; enabled: boolean }) => {
	const { data, isLoading, error } = useQuery({
		queryKey: ["userDepartments"],
		queryFn: () => fetchUserDepartments(ids ?? []),
		enabled,
	});

	return { data, isLoading, error };
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
