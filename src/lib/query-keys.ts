export const QueryKeys = {
	// Session
	SESSION: ["session"] as const,

	// User Profile
	USER_PROFILE: ["userProfile"] as const,
	USER_PROFILE_BY_ID: (userId: string) => ["userProfile", userId] as const,

	// Follows
	FOLLOWERS: (userId: string) => ["followers", userId] as const,
	FOLLOWING: (userId: string) => ["following", userId] as const,
	FOLLOWERS_COUNT: (userId: string) => ["followersCount", userId] as const,
	FOLLOWING_COUNT: (userId: string) => ["followingCount", userId] as const,
	IS_FOLLOWING: (targetUserId: string) =>
		["isFollowing", targetUserId] as const,

	// Vehicles
	VEHICLES: ["vehicles"] as const,
	VEHICLE: (vehicleId: string) => ["vehicle", vehicleId] as const,
	USER_VEHICLES: (userId: string) => ["userVehicles", userId] as const,
	VEHICLE_SEARCH: (query: string) => ["vehicleSearch", query] as const,
	VEHICLE_RATING: (vehicleId: string) => ["vehicleRating", vehicleId] as const,
	VEHICLE_RATING_BY_USER: (vehicleId: string) =>
		["vehicleRatingByUser", vehicleId] as const,
	VEHICLE_COMMENTS: (vehicleId: string, page?: number) =>
		["vehicleComments", vehicleId, page] as const,
	VEHICLE_STATUSES: ["vehicleStatuses"] as const,
	VEHICLE_TAGS: ["vehicleTags"] as const,
	MOTORIZATION_TYPES: ["motorizationTypes"] as const,
	TRANSMISSION_TYPES: ["transmissionTypes"] as const,
	VEHICLE_TYPES: ["vehicleTypes"] as const,
	// Chat
	MESSAGES: (conversationId: string) => ["messages", conversationId] as const,
	CONVERSATIONS: ["conversations"] as const,
	CONVERSATION: (chatId: string) => ["conversation", chatId] as const,
	UNREAD_MESSAGES: ["unreadMessages"] as const,
	UNREAD_MESSAGES_CONVERSATION: (conversationId: string) =>
		["unreadMessages", conversationId] as const,
	TYPES: ["types"] as const,

	// Comments
	COMMENT_VOTES: (commentId: string) => ["commentVotes", commentId] as const,

	// Static Data
	INTERESTS: ["interests"] as const,
	USER_INTERESTS: ["userInterests"] as const,
	SERVICES: ["services"] as const,
	USER_SERVICES: ["userServices"] as const,
	DEPARTMENTS: ["departments"] as const,
	USER_DEPARTMENTS: ["userDepartments"] as const,
	BRANDS: ["brands"] as const,
	VEHICLE_TAGS_DETAILS: ["vehicleTagsDetails"] as const,
	NOTIFICATIONS: ["notifications"] as const,
} as const;
