import { useFetchConversations } from '@/network/chat';
import { Link } from 'expo-router';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

const ChatListComponent = () => {
  const { data: conversations, isLoading } = useFetchConversations();

  if (isLoading) {
    return <Text className="text-white">Loading...</Text>;
  }

  return (
    <View className="flex-1">
      <FlatList
        data={conversations}
        renderItem={({ item }) => (
          <Link href={`/chats/${item.id}`} asChild>
            <TouchableOpacity className="p-4 border-b border-gray-800">
              <Text className="text-white text-lg">{item.title || 'Chat'}</Text>
            </TouchableOpacity>
          </Link>
        )}
        keyExtractor={(item) => item.id}
      />
      <Link href="/chats/new-chat" asChild>
        <TouchableOpacity className="p-4 bg-blue-500 m-4 rounded">
          <Text className="text-white text-center">Create New Chat</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default ChatListComponent;