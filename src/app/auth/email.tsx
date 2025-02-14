import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/text-input";
import { type EmailLoginType, emailLoginSchema } from "@/lib/schemas/auth";
import { supabase } from "@/lib/supabase";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);

  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) throw error;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

  if (profile?.length === 0) {
    router.push("/(tabs)");
  } else {
    router.push("/onboarding");
  }
};

export default function Email() {
  const redirectTo = makeRedirectUri();
  const url = Linking.useURL();

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting, errors },
  } = useForm<EmailLoginType>({
    resolver: valibotResolver(emailLoginSchema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
    criteriaMode: "firstError",
    shouldFocusError: true,
  });

  useEffect(() => {
    if (url) createSessionFromUrl(url);
  }, [url]);

  const sendMagicLink = async (values: EmailLoginType) => {
    // Redirect to the email verification page and then redirect to the onboarding page
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        emailRedirectTo: `${redirectTo}/auth/email`,
      },
    });

    if (error) {
      console.log(JSON.stringify(error, null, 2));
      throw error;
    }

    router.push("/auth/verification");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="w-full flex-1 items-center justify-between h-screen pt-safe-offset-4 pb-safe-offset-20 px-safe-offset-6 bg-black">
        <View className="w-full flex-1 gap-2">
          <Text className="text-white text-2xl font-bold">
            Quel est votre adresse email ?
          </Text>

          <View className="flex-col w-full gap-4 mt-6">
            <Controller<EmailLoginType>
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Email"
                  name="email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  placeholderTextColor="white"
                  error={errors.email}
                />
              )}
            />
          </View>
        </View>

        <View className="w-full">
          <Button
            variant="secondary"
            label="Continuer"
            disabled={!isValid || isSubmitting}
            onPress={handleSubmit(sendMagicLink)}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
