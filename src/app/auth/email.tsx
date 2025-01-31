import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Text, TextInput, View } from "react-native";


import { Button } from "@/components/ui/button";

import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);

  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) throw error;

  console.log(data);

  router.push("/onboarding");
};

export default function Email() {
  const redirectTo = makeRedirectUri();
  const url = Linking.useURL();
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (url) createSessionFromUrl(url);
  }, [url]);

  const sendMagicLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email: inputValue,
      options: {
        emailRedirectTo: `${redirectTo}/auth/email`,
      },
    });

    if (error) throw error;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="w-full flex-1 items-center justify-between h-screen py-safe-offset-20 px-safe-offset-6 bg-black">
        <View className="w-full flex-1 gap-2">
          <Text className="text-white text-2xl font-bold">
            Quel est votre adresse email ?
          </Text>

          <View className="flex-col w-full gap-4 mt-6">
            <TextInput
              placeholder="Email"
              value={inputValue}
              onChangeText={setInputValue}
              className="text-white text-sm"
              placeholderTextColor="white"
            />
          </View>
        </View>

        <View className="w-full">
          <Button
            variant="secondary"
            label="Continuer"
            disabled={inputValue.length === 0}
            onPress={sendMagicLink}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
