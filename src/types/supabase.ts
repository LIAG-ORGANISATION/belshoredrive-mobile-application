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
        };
        Insert: {
          brand_id: string;
          name?: string | null;
          type?: string | null;
        };
        Update: {
          brand_id?: string;
          name?: string | null;
          type?: string | null;
        };
        Relationships: [];
      };
      conversation_participants: {
        Row: {
          conversation_id: string;
          joined_at: string | null;
          user_id: string;
        };
        Insert: {
          conversation_id: string;
          joined_at?: string | null;
          user_id: string;
        };
        Update: {
          conversation_id?: string;
          joined_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["conversation_id"];
          },
        ];
      };
      conversations: {
        Row: {
          conversation_id: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          conversation_id: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          conversation_id?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      departments: {
        Row: {
          department_id: string;
          department_number: number | null;
          name: string | null;
        };
        Insert: {
          department_id: string;
          department_number?: number | null;
          name?: string | null;
        };
        Update: {
          department_id?: string;
          department_number?: number | null;
          name?: string | null;
        };
        Relationships: [];
      };
      direct_messages: {
        Row: {
          content: string | null;
          conversation_id: string | null;
          message_id: string;
          read_at: string | null;
          recipient_id: string | null;
          sender_id: string | null;
          sent_at: string | null;
        };
        Insert: {
          content?: string | null;
          conversation_id?: string | null;
          message_id: string;
          read_at?: string | null;
          recipient_id?: string | null;
          sender_id?: string | null;
          sent_at?: string | null;
        };
        Update: {
          content?: string | null;
          conversation_id?: string | null;
          message_id?: string;
          read_at?: string | null;
          recipient_id?: string | null;
          sender_id?: string | null;
          sent_at?: string | null;
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
          type: string | null;
        };
        Insert: {
          created_at?: string;
          name?: string | null;
          tag_id?: string;
          type?: string | null;
        };
        Update: {
          created_at?: string;
          name?: string | null;
          tag_id?: string;
          type?: string | null;
        };
        Relationships: [];
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
        Relationships: [];
      };
      user_profiles: {
        Row: {
          biography: string | null;
          birth_year: number | null;
          favorite_vehicle_brands: string[] | null;
          interests: string[] | null;
          postal_address: string | null;
          profile_picture_url: string | null;
          pseudo: string | null;
          services: string[] | null;
          user_id: string;
          viewable_departments: string[] | null;
          website: string | null;
        };
        Insert: {
          biography?: string | null;
          birth_year?: number | null;
          favorite_vehicle_brands?: string[] | null;
          interests?: string[] | null;
          postal_address?: string | null;
          profile_picture_url?: string | null;
          pseudo?: string | null;
          services?: string[] | null;
          user_id: string;
          viewable_departments?: string[] | null;
          website?: string | null;
        };
        Update: {
          biography?: string | null;
          birth_year?: number | null;
          favorite_vehicle_brands?: string[] | null;
          interests?: string[] | null;
          postal_address?: string | null;
          profile_picture_url?: string | null;
          pseudo?: string | null;
          services?: string[] | null;
          user_id?: string;
          viewable_departments?: string[] | null;
          website?: string | null;
        };
        Relationships: [];
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
      vehicles: {
        Row: {
          braking: string | null;
          brand_id: string | null;
          chassis: string | null;
          driving_side: string | null;
          exterior: string | null;
          fuel: string | null;
          gearbox: string | null;
          max_speed: number | null;
          media: string[] | null;
          mileage: number | null;
          model: string | null;
          motorization: string | null;
          nickname: string | null;
          power: number | null;
          purchase_date: string | null;
          status: string | null;
          tags: string[] | null;
          type: string | null;
          user_id: string | null;
          vehicle_id: string;
          year: number | null;
        };
        Insert: {
          braking?: string | null;
          brand_id?: string | null;
          chassis?: string | null;
          driving_side?: string | null;
          exterior?: string | null;
          fuel?: string | null;
          gearbox?: string | null;
          max_speed?: number | null;
          media?: string[] | null;
          mileage?: number | null;
          model?: string | null;
          motorization?: string | null;
          nickname?: string | null;
          power?: number | null;
          purchase_date?: string | null;
          status?: string | null;
          tags?: string[] | null;
          type?: string | null;
          user_id?: string | null;
          vehicle_id: string;
          year?: number | null;
        };
        Update: {
          braking?: string | null;
          brand_id?: string | null;
          chassis?: string | null;
          driving_side?: string | null;
          exterior?: string | null;
          fuel?: string | null;
          gearbox?: string | null;
          max_speed?: number | null;
          media?: string[] | null;
          mileage?: number | null;
          model?: string | null;
          motorization?: string | null;
          nickname?: string | null;
          power?: number | null;
          purchase_date?: string | null;
          status?: string | null;
          tags?: string[] | null;
          type?: string | null;
          user_id?: string | null;
          vehicle_id?: string;
          year?: number | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
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
