import { formatPicturesUri } from '@/lib/helpers/format-pictures-uri';
import { useFetchConversations } from '@/network/chat';
import { useFetchUserProfile } from '@/network/user-profile';
import { Link } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

const ChatListComponent = () => {
  const { data: conversations, isLoading } = useFetchConversations();
  const { data: currentUserProfile } = useFetchUserProfile();

  const getConversationTitle = (conversation: {
    title: string;
    participants: {
      pseudo: string;
      profile_picture_url: string;
      user_id: string;
    }[];
  }) => {
    if (conversation.title) return conversation.title;

    const otherParticipants = conversation.participants
      .filter((p: { user_id: string }) => p.user_id !== currentUserProfile?.user_id)
      .map((p: { pseudo: string }) => p.pseudo || 'Unknown User')
      .join(', ');

    return otherParticipants || 'Chat';
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={conversations}
        renderItem={({ item }) => (
          <Link href={`/(chats)/details/${item.id}`} asChild>
            <TouchableOpacity className="p-4 border-b border-gray-600 flex flex-row justify-between items-center">
              <View className="flex flex-row items-center gap-4">
                <Image
                  source={{ uri: formatPicturesUri('profile_pictures', item.participants[0].profile_picture_url) }}
                  className="w-10 h-10 rounded-full"
                />
                <Text className="text-white text-lg">{getConversationTitle(item)}</Text>
              </View>
              {item.unreadCount > 0 && (
                <View className="bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                  <Text className="text-white text-sm">
                    {item.unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </Link>
        )}
        keyExtractor={(item) => item.id}
      />
      <Link href="/(chats)/new-chat" asChild>
        <TouchableOpacity className="p-4 bg-primary m-4 rounded">
          <Text className="text-white text-center font-bold">Create New Chat</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default ChatListComponent;