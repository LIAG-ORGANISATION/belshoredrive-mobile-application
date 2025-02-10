import { Input } from '@/components/ui/text-input';
import { supabase } from '@/lib/supabase';
import { useFetchUserProfile } from '@/network/user-profile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { usePubNub } from 'pubnub-react';
import React, { useState } from 'react';
import { Button, TextInput, View } from 'react-native';

const NewChatComponent = () => {
  const pubnub = usePubNub();
  const [chatName, setChatName] = useState('');
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { data: profile, isLoading: loadingProfile } = useFetchUserProfile();

  const createChatMutation = useMutation({
    mutationFn: async ({ name, participants }: { name: string, participants: string[] }) => {
      const { data, error } = await supabase
        .from('chats')
        .insert({ name, participants, created_by: profile?.user_id })
        .select()
        .single();

      if (error) throw error;

      const timestamp = Math.floor(Date.now() / 1000);

      // First grant permissions for all participants
      for (const participantId of participants) {
        try {
          const token = await pubnub.grantToken({
            ttl: 0,
            authorized_uuid: participantId,
            resources: {
              channels: {
                [data.id]: {
                  read: true,
                  write: true,
                  manage: true
                }
              }
            },
          });

          console.log(token);
        } catch (error) {
          console.error(JSON.stringify(error, null, 2));
          throw error;
        }
      }

      // Then set channel metadata
      try {
        const metadata = await pubnub.objects.setChannelMetadata({
          channel: data.id,
          data: { name: name }
        });
        console.log(metadata);
      } catch (error) {
        console.error(JSON.stringify(error, null, 2));
        throw error;
      }


      return data;
    },
    onSuccess: (newChat) => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      router.push(`/chats/${newChat.id}`);
    },
  });

  const getParticipantIds = async (ids: string[]) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('user_id')
      .in('user_id', ids);

      if (error) throw error;

      return data.map(user => user.user_id);
  };

  const handleCreateChat = async () => {
    if (!profile?.user_id) return;

    const memberIds = await getParticipantIds(participantIds);

    createChatMutation.mutate({
      name: chatName,
      participants: [profile.user_id, ...memberIds],
    });
  };


  return (
    <View className="flex-1 p-4 py-safe-offset-10 flex flex-col gap-4">
      <Input
        name="chatName"
        value={chatName}
        onChangeText={setChatName}
        placeholder="Chat Name"
      />
      <Input
        name="participantIds"
        value={participantIds.join(',')}
        onChangeText={(text) => setParticipantIds(text.split(','))}
        placeholder="Participant IDs (comma-separated)"
      />
      <Button title="Create Chat" onPress={handleCreateChat} />
    </View>
  );
};

export default NewChatComponent;
