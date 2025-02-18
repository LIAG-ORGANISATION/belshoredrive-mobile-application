import { Input } from "@/components/ui/text-input";
import { useCreateConversation } from "@/network/chat";
import { router } from "expo-router";
import { useState } from "react";
import { Button, View } from "react-native";

const NewChatComponent = () => {
	const [title, setTitle] = useState("");
	const [participantId, setParticipantId] = useState("");
	const { mutate: createChat, isPending } = useCreateConversation();

	const handleCreate = () => {
		if (!participantId) return;

		createChat(
			{
				title: title || undefined,
				participantIds: [participantId],
			},
			{
				onSuccess: (conversation) => {
					router.push(`/(chats)/details/${conversation.id}`);
				},
			},
		);
	};

	return (
		<View className="flex-1 p-4 py-safe-offset-10 flex flex-col gap-4 bg-black">
			<Input
				name="title"
				value={title}
				onChangeText={setTitle}
				placeholder="Chat Title (optional)"
			/>
			<Input
				name="participantId"
				value={participantId}
				onChangeText={setParticipantId}
				placeholder="Participant ID"
			/>
			<Button
				title={isPending ? "Creating..." : "Create Chat"}
				onPress={handleCreate}
				disabled={isPending || !participantId}
			/>
		</View>
	);
};

export default NewChatComponent;
