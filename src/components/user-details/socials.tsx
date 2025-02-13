import type { Tables } from "@/types/supabase";
import { View } from "react-native";
import { Button } from "../ui/button";
import { FacebookIcon } from "../vectors/facebookIcon";
import { IconX } from "../vectors/icon-x";
import { InstagramIcon } from "../vectors/instagram-icon";
import { TikTokIcon } from "../vectors/tiktok-icon";

export const Socials = ({ user }: { user: Tables<"user_profiles"> }) => {
  return (
    <View className="flex flex-col gap-4">
      {user.instagram && (
        <Button
          variant="primary"
          className="!bg-black !justify-start gap-4 border-white/20 border-2"
          label="Instagram"
          onPress={() => {}}
          icon={<InstagramIcon />}
        />
      )}
      {user.facebook && (
        <Button
          variant="primary"
          className="!bg-black !justify-start gap-4 border-white/20 border-2"
          label="Facebook"
          onPress={() => {}}
          icon={<FacebookIcon />}
        />
      )}
      {user.twitter && (
        <Button
          variant="primary"
          className="!bg-black !justify-start gap-4 border-white/20 border-2"
          label="Twitter"
          onPress={() => {}}
          icon={
            <View className="opacity-50">
              <IconX />
            </View>
          }
        />
      )}
      {user.tiktok && (
        <Button
          variant="primary"
          className="!bg-black !justify-start gap-4 border-white/20 border-2"
          label="TikTok"
          onPress={() => {}}
          icon={<TikTokIcon />}
        />
      )}
    </View>
  );
};
