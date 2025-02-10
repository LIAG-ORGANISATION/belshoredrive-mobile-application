import type { Database } from "@/types/supabase";

export const checkIfProfileComplete = (
  profile: Database["public"]["Tables"]["user_profiles"]["Row"],
) => {
  if (!profile) return false;

  return (
    (!!profile.biography || profile.biography !== null) &&
    (!!profile.birth_year || profile.birth_year !== null) &&
    (!!profile.postal_address || profile.postal_address !== null) &&
    (!!profile.pseudo || profile.pseudo !== null) &&
    (!!profile.services || profile.services !== null) &&
    (!!profile.website || profile.website !== null) &&
    (!!profile.profile_picture_url || profile.profile_picture_url !== null)
  );
};
