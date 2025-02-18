import { ExternalLink } from "@/components/ExternalLink";
import { Button } from "@/components/ui/button";
import { CopyInput } from "@/components/ui/copy-input";
import { Tabs } from "@/components/ui/tabs";
import { VehicleCard } from "@/components/ui/vehicle-card";
import { UserDetails } from "@/components/user-details";
import { Socials } from "@/components/user-details/socials";
import { EditIcon } from "@/components/vectors/edit-icon";
import { IdentificationIcon } from "@/components/vectors/identification-icon";
import { LinkIcon } from "@/components/vectors/link-icon";
import { QrCodeIcon } from "@/components/vectors/qr-code-icon";
import { ShareIcon } from "@/components/vectors/share-icon";
import { WheelIcon } from "@/components/vectors/wheel-icon";
import { formatPicturesUri } from "@/lib/helpers/format-pictures-uri";
import { useFollowUser, useFollowingCount, useIsFollowing, useUnfollowUser } from "@/network/follows";
import { useFollowersCount } from "@/network/follows";
import { useGetSession } from "@/network/session";
import { useFetchUserProfileById } from "@/network/user-profile";
import { useUserVehicles } from "@/network/vehicles";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	Image,
	Modal,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function ProfileScreen() {
	const [isQrModalOpen, setIsQrModalOpen] = useState(false);
	const { initialTab, userId } = useLocalSearchParams();
	const { data: session } = useGetSession();
	const { data: profile } = useFetchUserProfileById(userId as string);
	const { data: vehicles } = useUserVehicles(userId as string);
	const { data: followersCount } = useFollowersCount(userId as string);
	const { data: followingCount } = useFollowingCount(userId as string);
	const { mutate: followUser } = useFollowUser();
	const { mutate: unfollowUser } = useUnfollowUser();
	const { data: isFollowing } = useIsFollowing(userId as string);
	const { width } = Dimensions.get("window");
	const isCurrentUser = session?.user.id === userId;

	if (!profile) {
		return (
			<View className="flex-1 items-center justify-center bg-black">
				<Text className="text-white">
					<ActivityIndicator size="large" color="#ffffff" />
				</Text>
			</View>
		);
	}

	return (
		<ScrollView className="w-full flex-1 bg-black text-white">
			{/* profile details */}
			<View className="w-full flex flex-col gap-2">
				<View className="flex flex-row gap-2">
					<View className="flex items-center justify-start">
						<Pressable
							onPress={() => {
								if (isCurrentUser) {
									router.push({
										pathname: "/(tabs)/update-avatar",
										params: { userId },
									});
								}
							}}
						>
							{profile?.profile_picture_url ? (
								<Image
									source={{
										uri: formatPicturesUri(
											"profile_pictures",
											profile?.profile_picture_url as string,
										),
									}}
									className={"w-24 h-24 rounded-full bg-cover"}
								/>
							) : (
								<View className="w-24 h-24 rounded-full bg-slate-500 flex items-center justify-center">
									<Ionicons name="image" size={20} color="white" />
								</View>
							)}
						</Pressable>
					</View>
					<View className="flex flex-col gap-1 justify-center">
						<Text className="text-2xl text-white font-bold">
							{profile?.pseudo}
						</Text>
						<Text className="text-sm text-gray-400 text-ellipsis">
							{profile?.postal_address}
						</Text>
					</View>
				</View>
				<Text className="text-sm text-white font-semibold">
					{profile?.biography}
				</Text>
				<View className="flex flex-row gap-2">
					<ExternalLink
						href={`https://${profile?.website}`}
						className="text-sm text-gray-400"
					>
						<View className="flex flex-row gap-2 items-center">
							<LinkIcon />
							<Text className="text-sm font-semibold text-[#A1BDCA]">
								{profile?.website}
							</Text>
						</View>
					</ExternalLink>
				</View>

				<View className="w-full flex flex-row gap-2 my-2">
					<View className="flex-1 ">
						{isCurrentUser ? (
							<Button
								variant="secondary"
								label="Modifier"
								onPress={() => {
								router.push({
									pathname: "/(tabs)/update-pseudo",
									params: { userId },
								});
								}}
								className="gap-2"
								icon={<EditIcon />}
							/>
						) : (
							<Button
								variant="secondary"
								label={isFollowing ? "Suivi" : "Suivre"}
								onPress={() => {
									if (isFollowing) {
										unfollowUser(userId as string);
									} else {
										followUser(userId as string);
									}
								}}
								className="gap-2"
							/>
						)}
					</View>
					<View className="flex-1">
						<Button
							variant="primary"
							label="Partager"
							onPress={() => {}}
							className="gap-2"
							icon={<ShareIcon fill="#ffffff" width={16} height={16} />}
						/>
					</View>
					<View className="w-fit">
						<Button
							variant="primary"
							label=""
							onPress={() => setIsQrModalOpen(true)}
							icon={<QrCodeIcon />}
						/>
					</View>
					<Modal
						visible={isQrModalOpen}
						transparent={true}
						animationType="slide"
					>
						<View className="flex-1 justify-end bg-black/50 rounded-t-2xl backdrop-blur-2xl">
							<View className="bg-[#1f1f1f]/80 w-full rounded-t-2xl overflow-hidden pb-safe-offset-2">
								<BlurView intensity={35} tint="dark">
									<View className="flex-row justify-end  p-4 border-b">
										<Pressable onPress={() => setIsQrModalOpen(false)}>
											<Text className="text-white font-bold">Fermer</Text>
										</Pressable>
									</View>
									<View className="w-full flex-col gap-4 justify-center items-center py-8 px-4">
										<View className="w-full items-center rounded-lg bg-[#0E57C1] py-8 px-4">
											<QRCode
												size={width * 0.8}
												color={"white"}
												value={`https://www.belshoredrive.com/${profile?.pseudo}`}
												backgroundColor="#0E57C1"
												logo={{
													uri: qrCodeLogoBase64,
												}}
												logoSize={90}
											/>
										</View>
										<CopyInput
											value={`https://www.belshoredrive.com/${profile?.pseudo}`}
										/>
										<View className="w-full flex flex-col gap-2">
											<Button
												variant="primary"
												label="Télécharger en PDF"
												className=" !justify-start gap-4"
												icon={
													<Ionicons
														name="download-outline"
														size={24}
														color="white"
													/>
												}
												onPress={() => {}}
											/>
											<Button
												variant="primary"
												label="Télécharger en image PNG"
												className=" !justify-start gap-4"
												icon={
													<Ionicons
														name="image-outline"
														size={24}
														color="white"
													/>
												}
												onPress={() => {}}
											/>
											<Button
												variant="primary"
												label="Imprimer"
												className=" !justify-start gap-4"
												icon={
													<Ionicons
														name="print-outline"
														size={24}
														color="white"
													/>
												}
												onPress={() => {}}
											/>
										</View>
									</View>
								</BlurView>
							</View>
						</View>
					</Modal>
				</View>
				<View className="w-full flex flex-row gap-2">
					<View className="flex-1 items-center justify-center px-2 py-2 border border-gray-700 rounded-lg">
						<Text className="text-lg font-semibold text-white">
							<Pressable onPress={() => {
								router.push({
									pathname: "/(tabs)/following",
									params: { userId },
								});
							}}
							>
								<Text className="text-white">{followingCount} suivi(e)s</Text>
							</Pressable>
						</Text>
					</View>
					<View className="flex-1 items-center justify-center px-2 py-2 border border-gray-700 rounded-lg">
						<Text className="text-lg font-semibold text-white">
							<Pressable onPress={() => {
								router.push({
									pathname: "/(tabs)/followers",
									params: { userId },
								});
							}}
							>
								<Text className="text-white">{followersCount} followers</Text>
							</Pressable>
						</Text>
					</View>
				</View>
			</View>
			<Tabs
				initialTab={Number(initialTab) || 0}
				tabs={[
					{
						content: (
							<View className="flex flex-col gap-4 h-full pb-10">
								{vehicles?.length === 0 && (
									<Text className="text-white">Aucun véhicule trouvé</Text>
								)}
								{vehicles?.map((item) => (
									<VehicleCard
										key={item.vehicle_id}
										item={item}
										user={profile}
									/>
								))}
							</View>
						),
						icon: <WheelIcon />,
					},
					{
						content: <UserDetails userId={profile?.user_id as string} />,
						icon: <IdentificationIcon />,
					},
					{
						content: <Socials user={profile} />,
						icon: <LinkIcon width={24} height={24} />,
					},
				]}
			/>
		</ScrollView>
	);
}

const qrCodeLogoBase64 =
	"data:image/png;base64,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";
