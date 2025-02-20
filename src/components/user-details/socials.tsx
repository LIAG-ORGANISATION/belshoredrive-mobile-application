import type { Tables } from "@/types/supabase";
import { ScrollView, View } from "react-native";
import { Text } from "react-native";
import { ExternalLink } from "../ExternalLink";

import { FacebookIcon } from "../vectors/facebookIcon";
import { IconX } from "../vectors/icon-x";
import { InstagramIcon } from "../vectors/instagram-icon";
import { TikTokIcon } from "../vectors/tiktok-icon";

export const Socials = ({ user }: { user: Tables<"user_profiles"> }) => {
	return (
		<ScrollView className="w-full flex-1 bg-black text-white pb-40">
			{/* profile details */}
			<View className="w-full flex flex-col gap-2">
				{user.instagram && (
					<ExternalLink
					href={`https://instagram.com/${user.instagram}`}
					className="w-full flex flex-row p-4 bg-black !justify-center items-center gap-4 border-white/20 border-2 rounded-md"
				>
					<View className="flex flex-row gap-2 items-center">
						<InstagramIcon />
						<Text className="text-white text-sm font-semibold">
							Join me on Instagram
						</Text>
					</View>
				</ExternalLink>
			)}
			{user.facebook && (
				<ExternalLink
					href={`https://facebook.com/${user.facebook}`}
					className="w-full flex flex-row p-4 bg-black !justify-center items-center gap-4 border-white/20 border-2 rounded-md"
				>
					<View className="flex flex-row gap-2 items-center">
						<FacebookIcon />
						<Text className="text-white text-sm font-semibold">
							Join me on Facebook
						</Text>
					</View>
				</ExternalLink>
			)}
			{user.twitter && (
				<ExternalLink
					href={`https://twitter.com/${user.twitter}`}
					className="w-full flex flex-row p-4 bg-black !justify-center items-center gap-4 border-white/20 border-2 rounded-md"
				>
					<View className="flex flex-row gap-2 items-center">
						<View className="opacity-50">
							<IconX />
						</View>
						<Text className="text-white text-sm font-semibold">
							Join me on Twitter
						</Text>
					</View>
				</ExternalLink>
			)}
			{user.tiktok && (
				<ExternalLink
					href={`https://tiktok.com/@${user.tiktok}`}
					className="w-full flex flex-row p-4 bg-black !justify-center items-center gap-4 border-white/20 border-2 rounded-md"
				>
					<View className="flex flex-row gap-2 items-center">
						<TikTokIcon />
						<Text className="text-white text-sm font-semibold">
							Join me on TikTok
						</Text>
					</View>
					</ExternalLink>
				)}
			</View>
		</ScrollView>
	);
};
