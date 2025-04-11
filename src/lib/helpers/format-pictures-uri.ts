export const formatPicturesUri = (bucketName: string, uri: string) => {
	if (!uri) return "";
	if (uri.includes("file://")) {
		return uri;
	}
	return `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${uri}`;
};
