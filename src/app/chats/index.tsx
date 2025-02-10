import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { supabase } from '@/lib/supabase';

const ChatListComponent = () => {
  const { data: chats, isLoading, error } = useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      const { data: userProfile } = await supabase
        .from('user_profile')
        .select('id')
        .single();

      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .contains('participants', [userProfile?.id]);

      if (error) throw error;

      return data;
    },
  });

  if (isLoading) return <Text>Loading chats...</Text>;
  if (error) return <Text>Error loading chats: {error.message}</Text>;

  const renderChatItem = ({ item }: { item: any }) => (
    <Link href={`/chats/${item.id}`} asChild>
      <TouchableOpacity>
        <Text className='text-white'>{item.name}</Text>
        <Text className='text-white'>{item.participants.length} participants</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id.toString()}
      />
      <Link href="/chats/new-chat" asChild>
        <TouchableOpacity>
          <Text className='text-white'>Create New Chat</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default ChatListComponent;
