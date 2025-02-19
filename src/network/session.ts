import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import type { UseQueryResult } from "@tanstack/react-query";

import { QueryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useGetSession(): UseQueryResult<Session> {
	return useQuery({
		queryKey: QueryKeys.SESSION,
		queryFn: async () => {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();

			if (!session) throw new Error("User not authenticated");

			return session;
		},
	});
}
