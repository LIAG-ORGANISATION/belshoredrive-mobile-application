import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function TabOneScreen() {
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // After successful logout, redirect to auth screen
      router.replace("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center gap-4">
      {/* <Link replace href="/onboarding"> */}
      <Text className="text-2xl font-bold">Profile</Text>
      {/* </Link> */}
      <View className="h-1 w-full bg-gray-200" />
      <Button 
        variant="primary"
        label="Logout"
        onPress={handleLogout}
      />
    </View>
  );
}
