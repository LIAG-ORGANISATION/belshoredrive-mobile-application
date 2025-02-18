import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/text-input";
import { CloseIcon } from "@/components/vectors/close-icon";
import { SuccessIcon } from "@/components/vectors/success-icon";
import { generateUsernameSuggestions } from "@/lib/helpers/generate-username";
import {
  type UsernameType,
  usernameSchema,
} from "@/lib/schemas/complete-profile";
import { useFetchUserProfile, useUpdateUserProfile } from "@/network/user-profile";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Controller, useForm } from "react-hook-form";

export const UpdatePseudo = ({ onSuccess, title }: { onSuccess: () => void, title?: string }) => {
  const { data: profile } = useFetchUserProfile();
  const {
    mutate: updateUserProfile,
    error,
  } = useUpdateUserProfile();
  const [usernameAvailable, setUsernameAvailable] = useState<boolean>(true);
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isValid, isSubmitting, errors },
  } = useForm<UsernameType>({
    resolver: valibotResolver(usernameSchema),
    defaultValues: {
      username: profile?.pseudo ?? "",
    },
    mode: "onBlur",
    criteriaMode: "firstError",
    shouldFocusError: true,
  });

  const username = watch("username");

  useEffect(() => {
    if (error?.message.includes("duplicate key")) {
      setUsernameAvailable(false);
      setUsernameSuggestions(generateUsernameSuggestions(username));
    }
  }, [error]);

  const postUsername = async (values: UsernameType) => {
    try {
      await updateUserProfile({
        pseudo: values.username,
      });

      setUsernameAvailable(true);
      setUsernameSuggestions([]);
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="w-full flex-1 items-start justify-between pt-2 pb-safe-offset-20 px-safe-offset-6 bg-black">
        <View className="w-full flex-1 gap-2">
          {title && (
            <Text className="text-white text-2xl font-bold">
              {title}
            </Text>
          )}

          <Text className="text-white/70 text-sm">
            Vous ne pouvez pas utiliser les accents, ni d’espace, ni caractères
            spéciaux hormis les traits d’union et l’underscore.
          </Text>

          <View className="flex-col w-full gap-4 mt-6">
            <Controller<UsernameType>
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Saisissez votre pseudo"
                  name="username"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholderTextColor="white"
                  error={errors.username}
                  icon={
                    <View className="absolute right-0 top-1/4">
                      {usernameAvailable ? (
                        <SuccessIcon />
                      ) : (
                        <CloseIcon fill="#FF3B30" />
                      )}
                    </View>
                  }
                />
              )}
            />
          </View>

          {!usernameAvailable && (
            <View className="w-full flex-col">
              {usernameSuggestions.map((suggestion, index) => (
                <Pressable
                  key={suggestion}
                  onPress={() => {
                    setValue("username", suggestion);
                  }}
                  className={`w-full p-4 pt-3 bg-white/10  border border-white/20 ${
                    index === 0 ? "rounded-t-lg" : ""
                  } ${
                    index === usernameSuggestions.length - 1
                      ? "rounded-b-lg"
                      : ""
                  }`}
                >
                  <Text className="text-white text-sm">{suggestion}</Text>
                  <View className="absolute right-4 top-1/2">
                    <SuccessIcon fill="#ffffff10" />
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
        <View className="w-full">
          <Button
            variant="secondary"
            label="Continuer"
            disabled={!isValid || isSubmitting}
            onPress={handleSubmit(postUsername)}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
