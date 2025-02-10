import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/text-input';
import { supabase } from '@/lib/supabase';
import { useFetchMessages, useSendMessage } from '@/network/chat';
import { useFetchUserProfile } from '@/network/user-profile';
import { Ionicons } from '@expo/vector-icons';

const ChatComponent = () => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const { chatId } = useLocalSearchParams();
  const { data: messages } = useFetchMessages(chatId as string);
  const { data: profile } = useFetchUserProfile();
  const { mutate: sendMessage } = useSendMessage();

  useEffect(() => {
    const channel = supabase
      .channel(`messages:${chatId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${chatId}`,
      }, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  const handleSend = () => {
    if (!message.trim()) return;

    sendMessage({
      conversationId: chatId as string,
      content: message.trim(),
    });

    setMessage('');
  };

  return (
    <View className="flex-1">
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View className={`p-2 m-2 rounded ${
            item.sender_id === profile?.user_id 
              ? 'bg-blue-500 ml-auto' 
              : 'bg-gray-700 mr-auto'
          }`}>
            <Text className="text-white">{item.content}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <View className="p-4 flex flex-row items-center gap-2">
        <View className="flex-1">
          <Input
            name="inputMessage"
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message"
          />
        </View>
        <Button onPress={handleSend} label="" icon={<Ionicons name="send" size={24} color="white" />} variant="primary" />
      </View>
    </View>
  );
};

export default ChatComponent;