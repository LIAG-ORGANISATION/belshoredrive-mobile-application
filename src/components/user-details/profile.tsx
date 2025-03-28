import { ExternalLink } from "@/components/ExternalLink";
import { BottomSheetContent } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
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
import { useBottomSheet } from "@/context/BottomSheetContext";
import { formatPicturesUri } from "@/lib/helpers/format-pictures-uri";
import { useCreateConversation } from "@/network/chat";
import {
	useFollowUser,
	useFollowingCount,
	useIsFollowing,
	useUnfollowUser,
} from "@/network/follows";
import { useFollowersCount } from "@/network/follows";
import { useFetchUserProfileById } from "@/network/user-profile";
import { useUserVehicles } from "@/network/vehicles";
import { Ionicons } from "@expo/vector-icons";
import type BottomSheet from "@gorhom/bottom-sheet";
import * as FileSystem from 'expo-file-system';
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from 'expo-sharing';
import { useCallback, useLayoutEffect, useRef } from "react";
import {
	Dimensions,
	Image,
	Pressable,
	ScrollView,
	Share,
	Text,
	View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SkeletonText } from "../ui/skeleton-text";

export const ProfileComponent = ({
	userId,
	isCurrentUser,
	showDraftVehicles,
}: { userId: string; isCurrentUser: boolean; showDraftVehicles: boolean }) => {
	const bottomSheetRef = useRef<BottomSheet>(null);

	const { initialTab } = useLocalSearchParams();

	const { data: profile, isLoading: isProfileLoading } =
		useFetchUserProfileById(userId as string);
	const { data: vehicles } = useUserVehicles(userId, showDraftVehicles);
	const { data: followersCount } = useFollowersCount(userId);
	const { data: followingCount } = useFollowingCount(userId);
	const { data: isFollowing } = useIsFollowing(userId);
	const { mutate: createChat } = useCreateConversation();

	const { mutate: followUser } = useFollowUser();
	const { mutate: unfollowUser } = useUnfollowUser();

	const { width } = Dimensions.get("window");

	const { registerSheet, showSheet } = useBottomSheet();

	const qrCodeRef = useRef<QRCode>();

	const handleCreate = () => {
		createChat(
			{
				title: undefined,
				participantIds: [userId],
			},
			{
				onSuccess: (conversation) => {
					router.push(`/(chats)/details/${conversation.id}`);
				},
			},
		);
	};

	const handleShare = async () => {
		if (!profile?.user_id) return;

		const shareUrl = `com.belshoredrive.app://${profile.user_id}`;

		try {
			await Share.share({
				message: shareUrl,
				url: shareUrl, // iOS only
				title: `Check out ${profile.pseudo}'s profile on Belshore Drive`
			});
		} catch (error) {
			console.error('Error sharing:', error);
		}
	};

	// Register the bottom sheet on component mount
	useLayoutEffect(() => {
		if (profile?.pseudo) {
			const qrCodeContent = (
				<BottomSheetContent>
					<View className="w-full flex-col gap-4 justify-center items-center py-8 px-4">
						<View className="w-full items-center rounded-lg bg-[#0E57C1] py-8 px-4">
							<QRCode
								getRef={(ref) => {
									qrCodeRef.current = ref;
								}}
								size={width * 0.8}
								color={"white"}
								value={`com.belshoredrive.app://${profile?.user_id}`}
								backgroundColor="#0E57C1"
								logo={{
									uri: qrCodeLogoBase64,
								}}
								logoSize={90}
							/>
						</View>
						<View className="w-full flex flex-col gap-2">
							<Button
								variant="primary"
								label="Télécharger en PNG"
								className=" !justify-start gap-4"
								icon={
									<Ionicons name="download-outline" size={24} color="white" />
								}
								onPress={async () => {
									console.log('Starting QR code save process...');
									try {
										if (!qrCodeRef.current) {
											console.log('QR code ref is null');
											return;
										}

										console.log('Getting QR code data URL...');
										qrCodeRef.current.toDataURL(async (dataURL) => {
											try {
												// Create a temporary file
												const tempFile = `${FileSystem.cacheDirectory}${profile?.pseudo || 'qrcode'}-${Date.now()}.png`;
												console.log('Creating temporary file:', tempFile);

												// Write to temp file
												await FileSystem.writeAsStringAsync(tempFile, dataURL, {
													encoding: FileSystem.EncodingType.Base64
												});

												// Check if sharing is available
												const isAvailable = await Sharing.isAvailableAsync();
												if (!isAvailable) {
													console.log('Sharing is not available');
													return;
												}

												// Open share dialog
												await Sharing.shareAsync(tempFile, {
													mimeType: 'image/png',
													dialogTitle: 'Save QR Code',
													UTI: 'public.png' // iOS only
												});

												// Clean up temp file
												await FileSystem.deleteAsync(tempFile, { idempotent: true });
											} catch (error) {
												console.error('Error in file operations:', error);
											}
										});
									} catch (error) {
										console.error('Error getting QR code data:', error);
										if (error instanceof Error) {
											console.error('Error details:', error.message);
										}
									}
								}}
							/>
						</View>
					</View>
				</BottomSheetContent>
			);

			registerSheet("profileQRCode", {
				id: "profileQRCode",
				component: qrCodeContent,
				snapPoints: ["50%"],
				enablePanDownToClose: true,
			});
		}
	}, [profile?.pseudo]);

	// Replace handleOpenBottomSheet with this new function
	const handleOpenBottomSheet = useCallback(() => {
		showSheet("profileQRCode");
	}, [showSheet]);

	return (
		<ScrollView className="w-full flex-1 bg-black text-white pt-4">
			{/* profile details */}
			<View className="w-full flex flex-col gap-2">
				<View className="flex flex-row gap-4">
					<View className="flex items-center justify-start">
						<Pressable
							onPress={() => {
								if (isCurrentUser) {
									router.replace({
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
							{isProfileLoading ? (
								<SkeletonText width="w-24" />
							) : (
								profile?.pseudo
							)}
						</Text>
						<Text className="text-sm text-gray-400 text-ellipsis">
							{isProfileLoading ? (
								<SkeletonText width="w-32" />
							) : (
								profile?.postal_address
							)}
						</Text>
					</View>
				</View>
				<Text className="text-sm text-white font-semibold">
					{isProfileLoading ? (
						<SkeletonText width="w-full" />
					) : (
						profile?.biography
					)}
				</Text>
				{profile?.website && (
					<View className="flex flex-row gap-2">
						<ExternalLink
							href={`https://${profile?.website}`}
							className="text-sm text-gray-400"
						>
							<View className="flex flex-row gap-2 items-center">
								<LinkIcon />
								<Text className="text-sm font-semibold text-[#A1BDCA]">
									Visitez mon site web
								</Text>
							</View>
						</ExternalLink>
					</View>
				)}

				<View className="w-full flex flex-row gap-2 my-2">
					<View className="flex-1 ">
						{isCurrentUser ? (
							<Button
								variant="secondary"
								label="Modifier"
								onPress={() => {
									router.replace({
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
								label={isFollowing ? "Unfollow" : "Follow"}
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
							label={isCurrentUser ? "Partager" : "Message"}
							onPress={() => {
								if (isCurrentUser) {
									handleShare();
								} else {
									handleCreate();
								}
							}}
							className="gap-2"
							icon={<ShareIcon fill="#ffffff" width={16} height={16} />}
						/>
					</View>
					{isCurrentUser && (
						<View className="w-fit">
							<Button
								variant="primary"
								label=""
								onPress={handleOpenBottomSheet}
								icon={<QrCodeIcon />}
							/>
						</View>
					)}
				</View>
				<View className="w-full flex flex-row gap-2">
					<View className="flex-1 items-center justify-center px-2 py-2 border border-gray-700 rounded-lg">
						<Text className="text-lg font-semibold text-white">
							<Pressable
								onPress={() => {
									router.replace({
										pathname: "/(tabs)/following",
										params: {
											userId,
											previousScreen: isCurrentUser ? "profile" : "user",
										},
									});
								}}
							>
								<Text className="text-white">{followingCount} suivi(e)s</Text>
							</Pressable>
						</Text>
					</View>
					<View className="flex-1 items-center justify-center px-2 py-2 border border-gray-700 rounded-lg">
						<Text className="text-lg font-semibold text-white">
							<Pressable
								onPress={() => {
									router.replace({
										pathname: "/(tabs)/followers",
										params: {
											userId,
											previousScreen: isCurrentUser ? "profile" : "user",
										},
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
									<VehicleCard key={item.vehicle_id} item={item} />
								))}
							</View>
						),
						icon: <WheelIcon />,
						id: "vehicles",
					},
					{
						content: <UserDetails userId={userId} />,
						icon: <IdentificationIcon />,
						id: "user-details",
					},
					{
						content: profile ? <Socials user={profile} /> : null,
						icon: <LinkIcon width={24} height={24} />,
						id: "socials",
					},
				]}
			/>
		</ScrollView>
	);
};

const qrCodeLogoBase64 =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAaASURBVHgB7Z3/edM8EMe/4eH/t52g7gS0E2AmoO8EpBOUTkCZoDABYQLKBDETUCawmYAwwXEXycUkdmzJinVO/HmeIyHND1tnnaS703kGpRDRCT9csLxgOWc5Y0lYTipSZWWlsI8/WXKWHyyPs9lsBYXMoATb4FcsL1lSmMYOyaOVjOUbK6TAsSONznLDsqThWbK8YUlwbPBJpxSn0Zv4wnKFQ4b+Xu056SVneYNDg0zD/6LxkNMhKIKMqclpvOQ0RkXwQSdk7Oqh8InGMliTmVmMydx0JSfNvYHMIHtPh4+c4wkCEWQhRqZ7LhF+8aSVguVViMXcM/SEG1/cBd9xPI0vJCxLe+696KUAMjZRGj9YlxwRCct36jkueCuAf/iGHxaYWHBbvIUnXmOAbfwPmKhyy2OCc5s4K8B2uQUm6pizEj67fMBJAZUBd6KZS1bCY9c3dx4D7FTzCybaWJLDqrlTD7ALj2ObavahgOkJrVG4rj3gHabGdyGBabNWWnsAX/1zfviECR9aB+WdCjhCF0NoxARd7nJZtClgwQ8xPYAZyzeH98uxJtDFAyvgf7gipofi4mz2SK8bPG065tmOk5GcmgTxOHfxNpLuNUrB53Je94faWRCZgTdBPAoPV29vz+QekQhhrb+oaRraaQq1R37AHc0KEN5RTSBnSwEKrn4hgzsvoRtp/Pnmi1tjgALbL0i0KXP5gIx00M/WWPBPDyCTHZYgPp2dWcKuWYYyks1j3TRBGqL+PpnM2u1/lX/G1ycFkFn1asiPdLr6Ldrtf5W0OhhXe0AKHWRwZ0w9QJiXT6oK0JJ05DQFtVdTgnHxunyyngVZ85MjPiu2/6cuH7AThzEGik5lrHtu/5NCBz72/2Lj8+K8k4vpt33tP5gtTrLVKYUe5MJZaFOAzwo4YXnP8qFt9mR7+hw6vKYycViUJkicWBoGsituxK/YM1YR4m1NEY/1omxmB7Ff0IGTB7QvFD/ecSqzIC1TuGI28M5F/r05/Ka9objQpAAf+x+Ca5jQYQzWCkiggwwRsL3uI+KQiALOoAOfKWgoJKczRi9YK0BLank0Bdjpa4zfP9NigjTUctj79LeGEy09IKb5KckwPCeyEtagAO8ZkF3HpDDnUbhG0ioUGJ6T59BBBkdsw8tq9mrj9QJms8QDHBATGCOqOdMQS+WTd92nkGB3ymRrSmDD9w7eFr13SQYggzv32D15kN7xFiNAFBB79uEagEnRLXSawAGKU4pgpUEBS8f3d41buzoYEwyPCgX8dHz/i47vy+BGDJ9YIQooEI+Vy4a28jMd3lO47lZEnMyK36IA1yswJD4LsC5jxjXcOcoe4LL5okQcZ02Kk97hk9aYIs4YUMhCLKYbIIMj1md0aZOIJb1jvQKGOY/Pnj6lOeLwGDskeRrbCRc5Jef0mW2AAsOjpZptrJjw+vzLlbCPLe5LzMF/TSVNJQZr018qIMPwZIjPHeLFQzL5p1SAk+cwEFFjAHYQj5mSsrY6T15IPiBxCaQYCFcPaEis6YlZ6Svj038lT6re0CFDchkiUXFlxwxELconz+peHIBOHlAyBWCXFKhMpN1LrKH0wtOk50kBdkqYYRi6ekAl7TyFqcHTSwlkyqxpaPyvjYEiMrWeh6DV70KmXHCVnDx89qSvVP7r6vHF2qaatfxdFNR0xS9gxqusaSFHRsFyoil07QnY2qZapwAJ5d1jHMhUtqqEBPX3l9HCVv2gOgXIwUsv0HoSY6W2YMdWUN526/eYCM1d3Yuay9UcEm7laiw+UaWJeu6a/tCoABtViuEjOjQWu+LTXYr2HWt19BAUaLnPwM7MOPvBW0z4cteWHtmamshfsEC8LTxj5mOX1JipdPF+KBCydLH9IvFfa4jhaqeAsfud2moqXx+e/ZSvF+wXT+uDZq5dUy2d9wfYQXmaGW1za9vGCe+47Mi8pvvG6/4xQq/AOE2l7YVrnyu/pHdmgh2YJXSY4LgoE4F7pdcESQ2h6VaG3gTZpGcP5BLHsWKWc7ycDVxapzNk7juQ0+Eh9yaYYwyQyedZ0OEgN6dOMDZo/L0hp/HUpW6GxqcIMTej2OjtBOlXRM5yQwHvmK0SPsErMnZVC0s6BFPjCpnBek5xUgeXpOBqj5ajvwmZWUZqRXbDh963W+DvfckelOxP06OATeyVKUoQZUhOjRQXLCul16UfripSwOxBk9wmSYXXsiFwiz8mTO2XABaosgAAAABJRU5ErkJggg==";
