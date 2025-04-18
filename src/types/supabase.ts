export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					operationName?: string;
					query?: string;
					variables?: Json;
					extensions?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			brands: {
				Row: {
					brand_id: string;
					name: string | null;
					type: string | null;
					type_id: string | null;
				};
				Insert: {
					brand_id: string;
					name?: string | null;
					type?: string | null;
					type_id?: string | null;
				};
				Update: {
					brand_id?: string;
					name?: string | null;
					type?: string | null;
					type_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "fk_vehicle_type";
						columns: ["type_id"];
						isOneToOne: false;
						referencedRelation: "vehicle_types";
						referencedColumns: ["id"];
					},
				];
			};
			conversation_participants: {
				Row: {
					conversation_id: string;
					id: string;
					is_archived: boolean | null;
					joined_at: string;
					user_id: string;
				};
				Insert: {
					conversation_id: string;
					id?: string;
					is_archived?: boolean | null;
					joined_at?: string;
					user_id: string;
				};
				Update: {
					conversation_id?: string;
					id?: string;
					is_archived?: boolean | null;
					joined_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "conversation_participants_conversation_id_fkey";
						columns: ["conversation_id"];
						isOneToOne: false;
						referencedRelation: "conversations";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "conversation_participants_user_profiles_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "user_profiles";
						referencedColumns: ["user_id"];
					},
				];
			};
			conversations: {
				Row: {
					created_at: string;
					id: string;
					title: string | null;
				};
				Insert: {
					created_at?: string;
					id?: string;
					title?: string | null;
				};
				Update: {
					created_at?: string;
					id?: string;
					title?: string | null;
				};
				Relationships: [];
			};
			departments: {
				Row: {
					department_id: string;
					department_number: string | null;
					name: string | null;
				};
				Insert: {
					department_id: string;
					department_number?: string | null;
					name?: string | null;
				};
				Update: {
					department_id?: string;
					department_number?: string | null;
					name?: string | null;
				};
				Relationships: [];
			};
			interests: {
				Row: {
					interest_id: string;
					name: string | null;
				};
				Insert: {
					interest_id: string;
					name?: string | null;
				};
				Update: {
					interest_id?: string;
					name?: string | null;
				};
				Relationships: [];
			};
			messages: {
				Row: {
					attachment_type: string | null;
					attachment_url: string | null;
					content: string;
					conversation_id: string;
					created_at: string;
					has_attachment: boolean | null;
					id: string;
					read: boolean;
					sender_id: string;
				};
				Insert: {
					attachment_type?: string | null;
					attachment_url?: string | null;
					content: string;
					conversation_id: string;
					created_at?: string;
					has_attachment?: boolean | null;
					id?: string;
					read?: boolean;
					sender_id: string;
				};
				Update: {
					attachment_type?: string | null;
					attachment_url?: string | null;
					content?: string;
					conversation_id?: string;
					created_at?: string;
					has_attachment?: boolean | null;
					id?: string;
					read?: boolean;
					sender_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "messages_conversation_id_fkey";
						columns: ["conversation_id"];
						isOneToOne: false;
						referencedRelation: "conversations";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "messages_sender_user_profiles_fkey";
						columns: ["sender_id"];
						isOneToOne: false;
						referencedRelation: "user_profiles";
						referencedColumns: ["user_id"];
					},
				];
			};
			motorization_types: {
				Row: {
					motorization_id: string;
					name: string;
					type_id: string | null;
				};
				Insert: {
					motorization_id?: string;
					name: string;
					type_id?: string | null;
				};
				Update: {
					motorization_id?: string;
					name?: string;
					type_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "motorisation_types_type_id_fkey";
						columns: ["type_id"];
						isOneToOne: false;
						referencedRelation: "vehicle_types";
						referencedColumns: ["id"];
					},
				];
			};
			notifications: {
				Row: {
					body: string;
					created_at: string | null;
					data: Json | null;
					id: string;
					read: boolean | null;
					title: string;
					type: string;
					user_id: string;
				};
				Insert: {
					body: string;
					created_at?: string | null;
					data?: Json | null;
					id?: string;
					read?: boolean | null;
					title: string;
					type: string;
					user_id: string;
				};
				Update: {
					body?: string;
					created_at?: string | null;
					data?: Json | null;
					id?: string;
					read?: boolean | null;
					title?: string;
					type?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			services: {
				Row: {
					name: string | null;
					service_id: string;
				};
				Insert: {
					name?: string | null;
					service_id: string;
				};
				Update: {
					name?: string | null;
					service_id?: string;
				};
				Relationships: [];
			};
			tags: {
				Row: {
					created_at: string;
					name: string | null;
					tag_id: string;
					type_id: string | null;
				};
				Insert: {
					created_at?: string;
					name?: string | null;
					tag_id?: string;
					type_id?: string | null;
				};
				Update: {
					created_at?: string;
					name?: string | null;
					tag_id?: string;
					type_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "fk_vehicle_type";
						columns: ["type_id"];
						isOneToOne: false;
						referencedRelation: "vehicle_types";
						referencedColumns: ["id"];
					},
				];
			};
			transmission_types: {
				Row: {
					name: string;
					transmission_id: string;
					type_id: string | null;
				};
				Insert: {
					name: string;
					transmission_id?: string;
					type_id?: string | null;
				};
				Update: {
					name?: string;
					transmission_id?: string;
					type_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "transmission_types_type_id_fkey";
						columns: ["type_id"];
						isOneToOne: false;
						referencedRelation: "vehicle_types";
						referencedColumns: ["id"];
					},
				];
			};
			user_follows: {
				Row: {
					followed_at: string | null;
					followee_id: string;
					follower_id: string;
				};
				Insert: {
					followed_at?: string | null;
					followee_id: string;
					follower_id: string;
				};
				Update: {
					followed_at?: string | null;
					followee_id?: string;
					follower_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_follows_followee_id_fkey1";
						columns: ["followee_id"];
						isOneToOne: false;
						referencedRelation: "user_profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "user_follows_follower_id_fkey1";
						columns: ["follower_id"];
						isOneToOne: false;
						referencedRelation: "user_profiles";
						referencedColumns: ["user_id"];
					},
				];
			};
			user_profiles: {
				Row: {
					biography: string | null;
					birth_year: number | null;
					created_at: string;
					expo_push_token: string | null;
					facebook: string | null;
					favorite_vehicle_brands: string[] | null;
					instagram: string | null;
					interests: string[] | null;
					postal_address: string | null;
					profile_picture_url: string | null;
					pseudo: string | null;
					services: string[] | null;
					tiktok: string | null;
					twitter: string | null;
					user_id: string;
					viewable_departments: string[] | null;
					website: string | null;
				};
				Insert: {
					biography?: string | null;
					birth_year?: number | null;
					created_at?: string;
					expo_push_token?: string | null;
					facebook?: string | null;
					favorite_vehicle_brands?: string[] | null;
					instagram?: string | null;
					interests?: string[] | null;
					postal_address?: string | null;
					profile_picture_url?: string | null;
					pseudo?: string | null;
					services?: string[] | null;
					tiktok?: string | null;
					twitter?: string | null;
					user_id: string;
					viewable_departments?: string[] | null;
					website?: string | null;
				};
				Update: {
					biography?: string | null;
					birth_year?: number | null;
					created_at?: string;
					expo_push_token?: string | null;
					facebook?: string | null;
					favorite_vehicle_brands?: string[] | null;
					instagram?: string | null;
					interests?: string[] | null;
					postal_address?: string | null;
					profile_picture_url?: string | null;
					pseudo?: string | null;
					services?: string[] | null;
					tiktok?: string | null;
					twitter?: string | null;
					user_id?: string;
					viewable_departments?: string[] | null;
					website?: string | null;
				};
				Relationships: [];
			};
			vehicle_comment_votes: {
				Row: {
					comment_id: string;
					created_at: string;
					user_id: string;
					vote_type: string;
				};
				Insert: {
					comment_id: string;
					created_at?: string;
					user_id: string;
					vote_type: string;
				};
				Update: {
					comment_id?: string;
					created_at?: string;
					user_id?: string;
					vote_type?: string;
				};
				Relationships: [
					{
						foreignKeyName: "vehicle_comment_votes_comment_id_fkey";
						columns: ["comment_id"];
						isOneToOne: false;
						referencedRelation: "vehicle_comments";
						referencedColumns: ["id"];
					},
				];
			};
			vehicle_comments: {
				Row: {
					content: string;
					created_at: string;
					id: string;
					updated_at: string | null;
					user_id: string;
					vehicle_id: string;
				};
				Insert: {
					content: string;
					created_at?: string;
					id?: string;
					updated_at?: string | null;
					user_id: string;
					vehicle_id: string;
				};
				Update: {
					content?: string;
					created_at?: string;
					id?: string;
					updated_at?: string | null;
					user_id?: string;
					vehicle_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "vehicle_comments_user_id_fkey1";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "user_profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "vehicle_comments_vehicle_id_fkey";
						columns: ["vehicle_id"];
						isOneToOne: false;
						referencedRelation: "vehicles";
						referencedColumns: ["vehicle_id"];
					},
				];
			};
			vehicle_ratings: {
				Row: {
					rating: number | null;
					user_id: string;
					vehicle_id: string;
				};
				Insert: {
					rating?: number | null;
					user_id: string;
					vehicle_id: string;
				};
				Update: {
					rating?: number | null;
					user_id?: string;
					vehicle_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "vehicle_ratings_vehicle_id_fkey";
						columns: ["vehicle_id"];
						isOneToOne: false;
						referencedRelation: "vehicles";
						referencedColumns: ["vehicle_id"];
					},
				];
			};
			vehicle_statuses: {
				Row: {
					name: string;
					status_id: string;
				};
				Insert: {
					name: string;
					status_id?: string;
				};
				Update: {
					name?: string;
					status_id?: string;
				};
				Relationships: [];
			};
			vehicle_types: {
				Row: {
					created_at: string;
					id: string;
					label: string | null;
				};
				Insert: {
					created_at?: string;
					id?: string;
					label?: string | null;
				};
				Update: {
					created_at?: string;
					id?: string;
					label?: string | null;
				};
				Relationships: [];
			};
			vehicles: {
				Row: {
					braking: string | null;
					brand_id: string | null;
					chassis: string | null;
					created_at: string | null;
					description: string | null;
					driving_side: string | null;
					exterior: string | null;
					fuel: string | null;
					gearbox: string | null;
					is_published: boolean;
					max_speed: number | null;
					media: string[] | null;
					mileage: number | null;
					model: string | null;
					motorization: string | null;
					motorization_id: string | null;
					nickname: string | null;
					power: number | null;
					purchase_date: string | null;
					status_id: string | null;
					tags: string[] | null;
					transmission_id: string | null;
					type_id: string | null;
					user_id: string | null;
					vehicle_id: string;
					year: number | null;
				};
				Insert: {
					braking?: string | null;
					brand_id?: string | null;
					chassis?: string | null;
					created_at?: string | null;
					description?: string | null;
					driving_side?: string | null;
					exterior?: string | null;
					fuel?: string | null;
					gearbox?: string | null;
					is_published?: boolean;
					max_speed?: number | null;
					media?: string[] | null;
					mileage?: number | null;
					model?: string | null;
					motorization?: string | null;
					motorization_id?: string | null;
					nickname?: string | null;
					power?: number | null;
					purchase_date?: string | null;
					status_id?: string | null;
					tags?: string[] | null;
					transmission_id?: string | null;
					type_id?: string | null;
					user_id?: string | null;
					vehicle_id?: string;
					year?: number | null;
				};
				Update: {
					braking?: string | null;
					brand_id?: string | null;
					chassis?: string | null;
					created_at?: string | null;
					description?: string | null;
					driving_side?: string | null;
					exterior?: string | null;
					fuel?: string | null;
					gearbox?: string | null;
					is_published?: boolean;
					max_speed?: number | null;
					media?: string[] | null;
					mileage?: number | null;
					model?: string | null;
					motorization?: string | null;
					motorization_id?: string | null;
					nickname?: string | null;
					power?: number | null;
					purchase_date?: string | null;
					status_id?: string | null;
					tags?: string[] | null;
					transmission_id?: string | null;
					type_id?: string | null;
					user_id?: string | null;
					vehicle_id?: string;
					year?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "vehicles_brand_id_fkey";
						columns: ["brand_id"];
						isOneToOne: false;
						referencedRelation: "brands";
						referencedColumns: ["brand_id"];
					},
					{
						foreignKeyName: "vehicles_motorization_id_fkey";
						columns: ["motorization_id"];
						isOneToOne: false;
						referencedRelation: "motorization_types";
						referencedColumns: ["motorization_id"];
					},
					{
						foreignKeyName: "vehicles_status_id_fkey";
						columns: ["status_id"];
						isOneToOne: false;
						referencedRelation: "vehicle_statuses";
						referencedColumns: ["status_id"];
					},
					{
						foreignKeyName: "vehicles_transmission_id_fkey";
						columns: ["transmission_id"];
						isOneToOne: false;
						referencedRelation: "transmission_types";
						referencedColumns: ["transmission_id"];
					},
					{
						foreignKeyName: "vehicles_type_id_fkey";
						columns: ["type_id"];
						isOneToOne: false;
						referencedRelation: "vehicle_types";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "vehicles_user_id_fkey1";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "user_profiles";
						referencedColumns: ["user_id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			get_unread_message_counts: {
				Args: {
					user_id: string;
					conversation_ids: string[];
				};
				Returns: {
					conversation_id: string;
					count: number;
				}[];
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			http_header: {
				field: unknown | null;
				value: string | null;
			};
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema["Tables"] & PublicSchema["Views"])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
				Database[PublicTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
			Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
				PublicSchema["Views"])
		? (PublicSchema["Tables"] &
				PublicSchema["Views"])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends
		| keyof PublicSchema["Enums"]
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
		? PublicSchema["Enums"][PublicEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof PublicSchema["CompositeTypes"]
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
		? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;
