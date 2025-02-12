import type { Tables } from "@/types/supabase";

export const checkIfProfileComplete = (
  profile: Partial<Tables<"user_profiles">>,
) => {
  if (!profile) return false;
  if (!profile.pseudo || profile.pseudo === null)
    return "/complete-profile/index";
  if (!profile.profile_picture_url || profile.profile_picture_url === null)
    return "/complete-profile/profile-picture";
  if (!profile.biography || profile.biography === null)
    return "/complete-profile/profile-details";
  if (!profile.birth_year || profile.birth_year === null)
    return "/complete-profile/profile-details";
  if (!profile.postal_address || profile.postal_address === null)
    return "/complete-profile/profile-details";
  if (!profile.website || profile.website === null)
    return "/complete-profile/profile-details";
  if (!profile.instagram || profile.instagram === null)
    return "/complete-profile/profile-details";
  if (!profile.facebook || profile.facebook === null)
    return "/complete-profile/profile-details";
  if (!profile.twitter || profile.twitter === null)
    return "/complete-profile/profile-details";
  if (!profile.tiktok || profile.tiktok === null)
    return "/complete-profile/profile-details";
  if (!profile.services || profile.services === null)
    return "/complete-profile/services";

  return true;
};
