import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import type { UseQueryResult } from "@tanstack/react-query";

import { useQuery } from "@tanstack/react-query";

export function useGetSession(): UseQueryResult<Session> {
	return useQuery({
		queryKey: ["session"],
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
