import { decode } from "base64-arraybuffer";
import { supabase } from "../supabase";

type FileType = "pdf" | "image";

export const uploadFileToConversation = async (
	conversationId: string,
	file: string,
	fileType: FileType,
	fileName: string,
) => {
	try {
		const arrayBuffer = decode(file);
		const filePath = `${conversationId}/${Date.now()}_${fileName}`;

		const { data, error } = await supabase.storage
			.from("conversations")
			.upload(filePath, arrayBuffer, {
				contentType: fileType === "pdf" ? "application/pdf" : "image/jpeg",
				upsert: false,
			});

		if (error) throw error;
		return data.path;
	} catch (error) {
		console.error("Error uploading file:", error);
		throw error;
	}
};
