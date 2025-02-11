import { useQueryClient } from '@tanstack/react-query';
import { Stack, router, useLocalSearchParams, useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { FlatList, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/text-input';
import { supabase } from '@/lib/supabase';
import { useFetchMessages, useSendMessage } from '@/network/chat';
import { useFetchUserProfile } from '@/network/user-profile';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';

const ChatComponent = () => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const { chatId } = useLocalSearchParams();
  const { data: messages } = useFetchMessages(chatId as string);
  const { data: profile } = useFetchUserProfile();
  const { mutate: sendMessage } = useSendMessage();

  const { data: conversation } = useQuery({
    queryKey: ['conversation', chatId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          title,
          conversation_participants!inner(
            user_id
          )
        `)
        .eq('id', chatId)
        .single();

      if (error) {
        console.error(error);
        throw error;
      }

      // Fetch user profiles separately
      const userIds = data.conversation_participants.map(p => p.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('user_id, pseudo')
        .in('user_id', userIds);

      if (profilesError) {
        console.log(JSON.stringify(profilesError, null, 2));
        throw profilesError;
      }

      // Combine the data
      return {
        ...data,
        conversation_participants: data.conversation_participants.map(participant => ({
          ...participant,
          user_profiles: profiles.find(p => p.user_id === participant.user_id)
        }))
      };
    },
  });

  useLayoutEffect(() => {
    if (conversation && profile) {
      if (conversation.title) {
        // TODO: Set the title
      } else {
        const OTHER_PARTICIPANTS = conversation.conversation_participants
          .filter(p => p.user_id !== profile.user_id)
          .map(p => p.user_profiles?.pseudo)
          .filter(Boolean);

        if (OTHER_PARTICIPANTS.length > 0) {
          const TITLE = OTHER_PARTICIPANTS.join(', ');
          // TODO: Set the title
        }
      }
    }
  }, [conversation, profile]);

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