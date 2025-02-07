import { Button } from "@/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import * as Contacts from 'expo-contacts';
import { Image } from 'expo-image';
import { Link } from "expo-router";

import { useState } from 'react';
import { FlatList, Text, View } from "react-native";

export default function Contact() {
  const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contacts.Contact[]>([]);

  const handleContactPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();

    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.Image],
      });

      if (data.length > 0) {
        setContacts(data);
      }
    }
  };

  const isContactSelected = (contact: Contacts.Contact) => {
    return selectedContacts.some(c => c.id === contact.id);
  };

  const handleAddContact = (contact: Contacts.Contact) => {
    if (isContactSelected(contact)) {
      setSelectedContacts(selectedContacts.filter(c => c.id !== contact.id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 px-safe-offset-6">
        <Text className="text-white text-2xl font-bold py-4">Trouvez et invitez des connaissances </Text>

        {contacts.length === 0 && (
          <Text className="text-white text-sm py-4">
            En autorisant l'accès à votre répertoire, nous listerons vos contacts et vous pourrez les inviter plus facilement.Vos contacts ne seront pas contacté sans votre consentement.
          </Text>
        )}

        {contacts.length > 0 && (
          <FlatList
            data={contacts}
            renderItem={({ item }) => (
              <View className="flex-row items-center gap-2 py-3 border-b border-gray-700">
                <View className="w-12 h-12 rounded-full bg-gray-700">
                  <Image
                    className="w-full h-full rounded-full"
                    placeholder={{ blurhash }}
                    contentFit="cover"
                    transition={1000}
                  />
                </View>
                <View className="flex-1 flex-row items-center justify-between">
                  <Text className="text-white text-sm font-semibold">{item.name}</Text>
                  <Button
                    className={isContactSelected(item) ? "!bg-[#4aa8ba]" : ""}
                    variant="secondary"
                    label=""
                    icon={<Ionicons name={isContactSelected(item) ? "remove" : "add"}
                    size={16}
                    color={isContactSelected(item) ? "white" : "black"} />}
                    onPress={() => handleAddContact(item)}
                  />
                </View>
              </View>
              )}
            />
          )}
      </View>

      <View className="absolute bottom-0 w-full px-4 pb-10 pt-4 bg-black z-10 flex flex-col gap-4">
        <Button
          variant="secondary"
          label="Continuer"
          onPress={handleContactPermission}
        />

        {/* TODO : Add a link to the next step */}
        <Link href="/onboarding/brands" asChild>
          <Text className="text-white text-sm text-center font-semibold">Passer cette étape</Text>
        </Link>
      </View>
    </View>
  );
}