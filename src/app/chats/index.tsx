import { useFetchConversations } from '@/network/chat';
import { useFetchUserProfile } from '@/network/user-profile';
import { Link } from 'expo-router';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

const ChatListComponent = () => {
  const { data: conversations, isLoading } = useFetchConversations();
  const { data: currentUserProfile } = useFetchUserProfile();

  if (isLoading) {
    return <Text className="text-white">Loading...</Text>;
  }

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

  return (
    <View className="flex-1">
      <FlatList
        data={conversations}
        renderItem={({ item }) => (
          <Link href={`/chats/${item.id}`} asChild>
            <TouchableOpacity className="p-4 border-b border-gray-800">
              <Text className="text-white text-lg">{getConversationTitle(item)}</Text>
            </TouchableOpacity>
          </Link>
        )}
        keyExtractor={(item) => item.id}
      />
      <Link href="/chats/new-chat" asChild>
        <TouchableOpacity className="p-4 bg-primary m-4 rounded">
          <Text className="text-white text-center font-bold">Create New Chat</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default ChatListComponent;