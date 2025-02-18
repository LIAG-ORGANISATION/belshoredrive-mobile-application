export const formatPicturesUri = (bucketName: string, uri: string) => {
	return `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${uri}`;
};
