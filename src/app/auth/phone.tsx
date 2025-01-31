import { router } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

import PhoneInput, { type ICountry } from 'react-native-international-phone-number';

import { Button } from "@/components/ui/button";
import Ionicons from "@expo/vector-icons/build/Ionicons";

export default function Phone() {
  const [inputValue, setInputValue] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<ICountry>();

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="w-full flex-1 items-center justify-between h-screen py-safe-offset-20 px-safe-offset-6 bg-black">
        <View className="w-full flex-1 gap-2">
          <Text className="text-white text-2xl font-bold">
            Quel est votre numéro de téléphone ?
          </Text>

          <Text className="text-white text-sm">
            Uniquement utilisé pour confirmer votre identité.  Ce numéro restera confidentiel, ne sera ni vendu, ni utilisé pour de la publicité.
          </Text>

          <View className="flex-col w-full gap-4 mt-6">
            <PhoneInput
              value={inputValue}
              onChangePhoneNumber={setInputValue}
              selectedCountry={selectedCountry}
              onChangeSelectedCountry={setSelectedCountry}
              customCaret={<Ionicons name="chevron-down" size={16} color="white" onPress={() => router.back()} />}
              phoneInputStyles={{
                container: {
                  backgroundColor: "#1F1F1F",
                  borderColor: "#545454",
                },
                flagContainer: {
                  backgroundColor: "#1F1F1F",
                },
                caret: {
                },
                input: {
                  backgroundColor: "#1F1F1F",
                  color: "#FFFFFF",
                },
                divider: {
                  backgroundColor: "#545454",
                },
                callingCode: {
                  color: "#FFFFFF",
                },
              }}
              modalStyles={{
                modal: {
                  backgroundColor: "#1F1F1F",
                },
                divider: {
                  backgroundColor: "#545454",
                },
                countriesList: {
                  backgroundColor: "#1F1F1F",
                },
                searchInput: {
                  backgroundColor: "#1F1F1F",
                },
                countryButton: {
                  backgroundColor: "#1F1F1F",
                },
                noCountryText: {
                  backgroundColor: "#1F1F1F",
                },
                noCountryContainer: {
                  backgroundColor: "#1F1F1F",
                },
                flag: {
                  backgroundColor: "#1F1F1F",
                },
                callingCode: {
                  color: "#FFFFFF",
                },
                countryName: {
                  backgroundColor: "#1F1F1F",
                  color: "#FFFFFF",
                },
              }}
            />
          </View>
        </View>

        <View className="w-full">
          <Button
            variant="secondary"
            label="Continuer"
            disabled={inputValue.length === 0}
            onPress={() => {
              router.push("/auth/login");
            }}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
