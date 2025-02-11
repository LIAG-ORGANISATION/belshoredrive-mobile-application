import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation} from 'expo-router';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { FlatList, Image, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/text-input';
import { DirectMessageIcon } from '@/components/vectors/direct-message-icon';
import { supabase } from '@/lib/supabase';
import { useFetchMessages, useMarkConversationAsRead, useSendMessage } from '@/network/chat';
import { useFetchUserProfile } from '@/network/user-profile';

const ChatComponent = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const { chatId } = useLocalSearchParams();
  const { data: messages } = useFetchMessages(chatId as string);
  const { data: profile } = useFetchUserProfile();
  const { mutate: sendMessage } = useSendMessage();
  const { mutate: markConversationAsRead } = useMarkConversationAsRead();
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
        .select('user_id, pseudo, profile_picture_url')
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
        navigation.setOptions({
          title: conversation.title,
        });
      } else {
        const OTHER_PARTICIPANTS = conversation.conversation_participants
          .filter(p => p.user_id !== profile.user_id)
          .map(p => p.user_profiles?.pseudo)
          .filter(Boolean);

        if (OTHER_PARTICIPANTS.length > 0) {
          const TITLE = OTHER_PARTICIPANTS.join(', ');

          navigation.setOptions({
            title: TITLE,
          });
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


  useEffect(() => {
    if (messages) {
      markConversationAsRead(chatId as string);
    }
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    sendMessage({
      conversationId: chatId as string,
      content: message.trim(),
    });

    setMessage('');
  };

  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View className={`${
            item.sender_id === profile?.user_id
              ? 'flex-row-reverse items-end'
              : 'flex-row items-start'
          }`}>
            <View className='w-6 h-6 rounded-full bg-gray-700'>
              <Image source={{ uri: item.sender.profile_picture_url }} className='w-full h-full rounded-full' />
            </View>
            <View className={`p-2 m-2 rounded ${
              item.sender_id === profile?.user_id
                ? 'bg-primary ml-auto'
                : 'bg-gray-700 mr-auto'
            }`}>
              <Text className="text-white">{item.content}</Text>
            </View>
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
        <Button className='!bg-transparent' onPress={handleSend} label="" icon={<DirectMessageIcon fill="#fff" />} variant="primary" />
      </View>
    </View>
  );
};

export default ChatComponent;