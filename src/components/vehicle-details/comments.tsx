import { formatPicturesUri } from "@/lib/helpers/format-pictures-uri";
import { useCommentVotes, useVehicleComments, useVoteComment } from "@/network/comments";
import { useGetSession } from "@/network/session";
import type { PaginatedComments } from "@/network/vehicles";
import type { Tables } from "@/types/supabase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { router, usePathname } from "expo-router";
import { useMemo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { VoteIcon } from "../vectors/vote-icon";

dayjs.extend(relativeTime);

export const Comments = ({ comments }: { comments: PaginatedComments }) => {
	const [page, setPage] = useState(0);
	const { data: olderComments } = useVehicleComments(comments.data[0].vehicle_id, page);

	const allComments = useMemo(() => {
		const currentComments = comments.data;
		const previousComments = olderComments?.data || [];
		// Combine and remove duplicates based on comment id
		const combined = [...currentComments, ...previousComments];
		return Array.from(new Map(combined.map(item => [item.id, item])).values());
	}, [comments.data, olderComments?.data]);

	const hasMoreComments = olderComments?.count && olderComments.count > (page + 1) * 10;

	return (
		<View className="w-full h-fit">
			{allComments.map((comment) => (
				<CommentItem key={comment.id} comment={comment} />
			))}

			{hasMoreComments && (
				<Pressable
					onPress={() => setPage(prev => prev + 1)}
					className="mx-auto my-2 text-center py-4"
				>
					<Text className="text-white">Load previous comments</Text>
				</Pressable>
			)}
		</View>
	);
};

const CommentItem = ({
	comment,
}: {
	comment: Tables<"vehicle_comments"> & {
		user_profiles: Pick<
			Tables<"user_profiles">,
			"pseudo" | "profile_picture_url"
		>;
	};
}) => {
	const { data: votes } = useCommentVotes(comment.id);
	const { data: session } = useGetSession();
	const voteComment = useVoteComment();
	const pathname = usePathname();

	const upvotes =
		votes?.filter((vote) => vote.vote_type === "upvote").length || 0;
	const downvotes =
		votes?.filter((vote) => vote.vote_type === "downvote").length || 0;
	const voteScore = upvotes - downvotes;

	const userUpvoted = votes?.some(
		(vote) => vote.vote_type === "upvote" && vote.user_id === session?.user.id,
	);

	const userDownvoted = votes?.some(
		(vote) =>
			vote.vote_type === "downvote" && vote.user_id === session?.user.id,
	);

	const handleVote = (voteType: "upvote" | "downvote") => {
		if (!session) return; // Don't allow voting if not logged in
		voteComment.mutate({
			commentId: comment.id,
			voteType,
		});
	};

	return (
		<View className="flex-row p-3 gap-2">
			<Pressable
				className="flex-row items-center gap-2"
				onPress={() => {
					router.replace({
						pathname: "/(tabs)/user",
						params: {
							userId: comment.user_id,
							previousScreen: pathname,
						},
					});
				}}
			>
				<Image
					source={{
						uri: formatPicturesUri(
							"profile_pictures",
							comment.user_profiles?.profile_picture_url || "",
						),
					}}
					className="w-10 h-10 rounded-full"
				/>
			</Pressable>

			<View className="flex-1 flex-col gap-2">
				<View className="flex-row items-center gap-2">
					<Pressable
						className="flex-row items-center gap-2"
						onPress={() => {
							router.replace({
								pathname: "/(tabs)/user",
								params: {
									userId: comment.user_id,
									previousScreen: pathname,
								},
							});
						}}
					>
						<Text className="text-white font-bold">
							{comment.user_profiles.pseudo}
						</Text>
					</Pressable>
					<Text className="text-white my-1">{comment.content}</Text>
				</View>

				<View className="flex-row items-center mt-1 gap-2">
					<Pressable
						className="rounded-full p-1"
						onPress={() => handleVote("upvote")}
					>
						<VoteIcon fill={userUpvoted ? "white" : "gray"} />
					</Pressable>
					<Text className="text-neutral-500 mx-1">{voteScore}</Text>
					<Pressable
						className="rotate-180 rounded-full p-1"
						onPress={() => handleVote("downvote")}
					>
						<VoteIcon fill={userDownvoted ? "white" : "gray"} />
					</Pressable>

					<Text className="text-gray-400 text-xs">
						{dayjs(comment.created_at).fromNow()}
					</Text>
				</View>
			</View>
		</View>
	);
};
