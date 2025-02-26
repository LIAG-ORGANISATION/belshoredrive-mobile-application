import dayjs from "dayjs";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
	Image,
	KeyboardAvoidingView,
	Linking,
	Modal,
	Platform,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import "dayjs/locale/fr";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

import ImageView from "react-native-image-viewing";
import Pdf from 'react-native-pdf';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/text-input";
import { DirectMessageIcon } from "@/components/vectors/direct-message-icon";
import { formatPicturesUri } from "@/lib/helpers/format-pictures-uri";
import { supabase } from "@/lib/supabase";
import {
	useFetchMessages,
	useMarkConversationAsRead,
	useSendMessage,
} from "@/network/chat";
import { useFetchUserProfile } from "@/network/user-profile";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

dayjs.locale("fr");

export default function ChatView() {
	const navigation = useNavigation();
	const queryClient = useQueryClient();
	const [message, setMessage] = useState("");
	const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
	const [selectedImageUri, setSelectedImageUri] = useState("");
	const [isPdfViewerVisible, setIsPdfViewerVisible] = useState(false);
	const [selectedPdfUri, setSelectedPdfUri] = useState("");

	const flashListRef = useRef<FlashList<any>>(null);

	const { chatId } = useLocalSearchParams();
	const { data: messages } = useFetchMessages(chatId as string);
	const { data: profile } = useFetchUserProfile();
	const { mutate: sendMessage } = useSendMessage();
	const { mutate: markConversationAsRead } = useMarkConversationAsRead();
	const { data: conversation } = useQuery({
		queryKey: ["conversation", chatId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("conversations")
				.select(`
          title,
          conversation_participants!inner(
            user_id
          )
        `)
				.eq("id", chatId)
				.single();

			if (error) {
				throw error;
			}

			// Fetch user profiles separately
			const userIds = data.conversation_participants.map((p) => p.user_id);
			const { data: profiles, error: profilesError } = await supabase
				.from("user_profiles")
				.select("user_id, pseudo, profile_picture_url")
				.in("user_id", userIds);

			if (profilesError) {
				throw profilesError;
			}

			// Combine the data
			return {
				...data,
				conversation_participants: data.conversation_participants.map(
					(participant) => ({
						...participant,
						user_profiles: profiles.find(
							(p) => p.user_id === participant.user_id,
						),
					}),
				),
			};
		},
	});

	useLayoutEffect(() => {
		if (conversation && profile) {
			if (conversation.title) {
				navigation.setOptions({
					title: conversation.title,
				});
			} else {
				const OTHER_PARTICIPANTS = conversation.conversation_participants
					.filter((p) => p.user_id !== profile.user_id)
					.map((p) => p.user_profiles?.pseudo)
					.filter(Boolean);

				if (OTHER_PARTICIPANTS.length > 0) {
					const TITLE = OTHER_PARTICIPANTS.join(", ");

					navigation.setOptions({
						title: TITLE,
					});
				}
			}
		}
	}, [conversation, profile]);

	useEffect(() => {
		const channel = supabase
			.channel(`messages:${chatId}`)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "messages",
					filter: `conversation_id=eq.${chatId}`,
				},
				(payload) => {
					queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [chatId]);

	useEffect(() => {
		if (messages) {
			markConversationAsRead(chatId as string);
		}
	}, [messages]);

	useEffect(() => {
		if (messages && messages.length > 0) {
			requestAnimationFrame(() => {
				flashListRef.current?.scrollToEnd({ animated: false });
			});
		}
	}, [messages]);

	const handleSend = () => {
		if (!message.trim()) return;

		sendMessage({
			conversationId: chatId as string,
			content: message.trim(),
		});

		setMessage("");
		requestAnimationFrame(() => {
			flashListRef.current?.scrollToEnd({ animated: true });
		});
	};

	const handleAttachFile = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: "application/pdf",
				copyToCacheDirectory: true,
			});

			if (result.assets?.[0]) {
				const asset = result.assets[0];
				// Convert file to base64
				const base64 = await FileSystem.readAsStringAsync(asset.uri, {
					encoding: FileSystem.EncodingType.Base64,
				});

				sendMessage({
					conversationId: chatId as string,
					content: "📎 PDF Document",
					attachment: {
						base64,
						type: "pdf",
						fileName: asset.name,
					},
				});
			}
		} catch (error) {
			console.error("Error picking document:", error);
		}
	};

	const handleAttachImage = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				base64: true,
				quality: 0.7,
			});

			if (!result.canceled && result.assets[0]) {
				const asset = result.assets[0];
				sendMessage({
					conversationId: chatId as string,
					content: "📷 Image",
					attachment: {
						base64: asset.base64 || "",
						type: "image",
						fileName: `image_${Date.now()}.jpg`,
					},
				});
			}
		} catch (error) {
			console.error("Error picking image:", error);
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			className="flex-1 bg-black"
			keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}
		>
			<ImageView
				images={[{ uri: selectedImageUri }]}
				imageIndex={0}
				visible={isImageViewerVisible}
				onRequestClose={() => setIsImageViewerVisible(false)}
			/>
			<Modal
				visible={isPdfViewerVisible}
				onRequestClose={() => setIsPdfViewerVisible(false)}
				animationType="slide"
			>
				<SafeAreaView className="flex-1 bg-black pt-10">
					<View className="flex-row justify-between items-center p-4">
						<TouchableOpacity 
							onPress={() => setIsPdfViewerVisible(false)}
							className="p-2"
						>
							<Ionicons name="close" size={24} color="white" />
						</TouchableOpacity>
						<TouchableOpacity 
							onPress={() => Linking.openURL(selectedPdfUri)}
							className="p-2"
						>
							<Ionicons name="download-outline" size={24} color="white" />
						</TouchableOpacity>
					</View>

					<Pdf
						source={{ uri: selectedPdfUri }}
						style={{ flex: 1, backgroundColor: 'black' }}
						onLoadComplete={(numberOfPages, filePath) => {
							console.log(`Number of pages: ${numberOfPages}`);
						}}
						onError={(error) => {
							console.log(error);
						}}
					/>
				</SafeAreaView>
			</Modal>
			<View className="flex-1">
				<FlashList
					ref={flashListRef}
					data={messages}
					estimatedItemSize={100}
					keyboardShouldPersistTaps="handled"
					automaticallyAdjustKeyboardInsets={true}
					contentContainerStyle={{ paddingBottom: 20 }}
					renderItem={({ item }) => (
						<View
							className={`${
								item.sender_id === profile?.user_id
									? "flex-row-reverse items-end"
									: "flex-row items-start"
							}`}
						>
							<View className="w-6 h-6 rounded-full bg-gray-700">
								<Image
									source={{
										uri: formatPicturesUri(
											"profile_pictures",
											item.sender.profile_picture_url,
										),
									}}
									className="w-full h-full rounded-full"
								/>
							</View>
							<View
								className={`w-fit max-w-[80%] p-2 m-2 rounded flex flex-col gap-1.5 ${
									item.sender_id === profile?.user_id
										? "bg-primary ml-auto"
										: "bg-gray-700 mr-auto"
								}`}
							>
								<Text className="text-white">{item.content}</Text>
								{item.has_attachment && item.attachment_url && (
									item.attachment_type === "image" ? (
										<TouchableOpacity 
											onPress={() => {
												setSelectedImageUri(formatPicturesUri("conversations", item.attachment_url));
												setIsImageViewerVisible(true);
											}}
										>
											<Image
												source={{
													uri: formatPicturesUri("conversations", item.attachment_url),
												}}
												className="w-48 h-48 rounded-md"
												resizeMode="cover"
											/>
										</TouchableOpacity>
									) : (
										<TouchableOpacity 
											className="bg-gray-600 p-2 rounded-md"
											onPress={() => {
												const pdfUri = formatPicturesUri("conversations", item.attachment_url);
												setSelectedPdfUri(pdfUri);
												setIsPdfViewerVisible(true);
											}}
										>
											<Text className="text-white">📎 View PDF</Text>
										</TouchableOpacity>
									)
								)}
								<Text
									className={`text-xs ${
										item.sender_id === profile?.user_id
											? "text-gray-200"
											: "text-gray-400"
									}`}
								>
									{dayjs(item.created_at).isSame(dayjs(), "day")
										? dayjs(item.created_at).format("HH:mm")
										: dayjs(item.created_at).format("dddd D MMM [à] HH:mm")}
								</Text>
							</View>
						</View>
					)}
					keyExtractor={(item) => item.id}
				/>
				<View className="p-4 flex flex-row items-center gap-2">
					<View className="flex-row gap-2">
						<TouchableOpacity onPress={handleAttachImage}>
							<Ionicons name="image" size={24} color="white" />
						</TouchableOpacity>
						<TouchableOpacity onPress={handleAttachFile}>
							<Ionicons name="document" size={24} color="white" />
						</TouchableOpacity>
					</View>
					<View className="flex-1">
						<Input
							name="inputMessage"
							value={message}
							onChangeText={setMessage}
							placeholder="Type a message"
						/>
					</View>
					<Button
						className="!bg-transparent"
						onPress={handleSend}
						label=""
						icon={<DirectMessageIcon fill="#fff" />}
						variant="primary"
					/>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
};
