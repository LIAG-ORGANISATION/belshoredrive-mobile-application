import React from "react";

import { UpdateProfile } from "@/components/user-details/update-profile";
import { router } from "expo-router";

export default function ProfileDetails() {
  return (
    <UpdateProfile title="Informations du profil" onSuccess={() => router.push("/complete-profile/services")} />
  );
}
