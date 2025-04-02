import { Button } from "@/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import * as Contacts from "expo-contacts";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function Contact() {
	const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
	const [selectedContacts, setSelectedContacts] = useState<Contacts.Contact[]>(
		[],
	);

	const handleContactPermission = async () => {
		const { status } = await Contacts.requestPermissionsAsync();

		if (status === "granted") {
			const { data } = await Contacts.getContactsAsync({
				fields: [Contacts.Fields.Name, Contacts.Fields.Image],
			});

			if (data.length > 0) {
				setContacts(data);
			}
		}
	};

	const isContactSelected = (contact: Contacts.Contact) => {
		return selectedContacts.some((c) => c.id === contact.id);
	};

	const handleAddContact = (contact: Contacts.Contact) => {
		if (isContactSelected(contact)) {
			setSelectedContacts(selectedContacts.filter((c) => c.id !== contact.id));
		} else {
			setSelectedContacts([...selectedContacts, contact]);
		}
	};

	return (
		<View className="bg-black flex-1 px-2 relative">
			<Text className="text-white text-2xl font-bold my-4">
				Invitez des connaissances
			</Text>

			{contacts.length === 0 && (
				<Text className="text-white text-sm">
					En autorisant l'accès à votre répertoire, nous listerons vos contacts
					et vous pourrez les inviter plus facilement.Vos contacts ne seront pas
					contacté sans votre consentement.
				</Text>
			)}

			<View className="flex-2" style={{ flex: 1 }}>
				<FlashList
					data={contacts}
					estimatedItemSize={70}
					renderItem={({ item }) => (
						<View className="flex-row items-center gap-2 py-3 border-b border-gray-700">
							<View className="w-12 h-12 rounded-full bg-gray-700"></View>
							<View className="flex-1 flex-row items-center justify-between">
								<Text className="text-white text-sm font-semibold">
									{item.name}
								</Text>
								<Button
									className={isContactSelected(item) ? "!bg-[#4aa8ba]" : ""}
									variant="secondary"
									label=""
									icon={
										<Ionicons
											name={isContactSelected(item) ? "remove" : "add"}
											size={16}
											color={isContactSelected(item) ? "white" : "black"}
										/>
									}
									onPress={() => handleAddContact(item)}
								/>
							</View>
						</View>
					)}
				/>
			</View>

			<View className="bottom-0 w-full px-4 pb-10 pt-4 bg-black z-50 gap-4">
				<Button
					variant="secondary"
					label="Continuer"
					onPress={handleContactPermission}
				/>
				<Link href="/(tabs)" className="w-full text-center">
					<Text className="text-white text-sm">Passer cette étape</Text>
				</Link>
			</View>
		</View>
	);
}
