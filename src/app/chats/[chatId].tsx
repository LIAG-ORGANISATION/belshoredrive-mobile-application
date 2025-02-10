import { Input } from '@/components/ui/text-input';
import { useFetchUserProfile } from '@/network/user-profile';
import { useLocalSearchParams } from 'expo-router';
import { usePubNub } from 'pubnub-react';
import React, { useEffect, useState, useCallback } from 'react';
import { Button, FlatList, Text, View } from 'react-native';

interface Message {
  text: string;
  sender: string;
  timestamp: string;
}

const ChatComponent = () => {
  const { id: chatId } = useLocalSearchParams();
  const pubnub = usePubNub();

  if (!chatId) {
    return <View><Text className="text-white">Invalid chat ID</Text></View>;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);

  const { data: profile, isLoading: loadingProfile } = useFetchUserProfile();

  const fetchMessageHistory = useCallback(async () => {
    try {
      if (typeof chatId !== 'string') {
        throw new Error('Invalid chat ID');
      }

      await pubnub.fetchMessages({
        channels: [chatId],
        count: 100
      }, (status, response) => {
        if (status.error) {
          console.error('Error fetching message history:', status.errorData);
        } else {
          const fetchedMessages = response?.channels[chatId] || [];
          setMessages(fetchedMessages.map(m => m.message));
        }
      });
    } catch (error) {
      console.error('Error fetching message history:', error);
    }
  }, [pubnub, chatId]);

  useEffect(() => {
    pubnub.subscribe({
      channels: [chatId as string],
      withPresence: true
    });

    fetchMessageHistory();

    const listener = {
      message: (message: Message) => {
        console.log("Message received", message);
        setMessages(prevMessages => [...prevMessages, message]);
      },
      presence: (presenceEvent: { action: string }) => {
        if (presenceEvent.action === 'join' || presenceEvent.action === 'leave') {
          pubnub.hereNow({ channels: [chatId as string] })
            .then(response => {
              const occupants = response.channels[chatId as string].occupants;
              setParticipants(occupants.map(o => o.uuid));
            });
        }
      }
    };

    pubnub.addListener(listener);

    return () => {
      pubnub.removeListener(listener);
      pubnub.unsubscribe({ channels: [chatId as string] });
    };
  }, [pubnub, chatId, fetchMessageHistory, profile]);

  const sendMessage = () => {

    if (inputMessage) {
      pubnub.publish({
        channel: chatId as string,
        message: {
          text: inputMessage,
          sender: profile?.pseudo || 'Anonymous',
          timestamp: new Date().toISOString()
        }
      });
      setInputMessage('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View className='flex-row'>
      <View className='flex-1'>
        <Text className='text-white'>{item.sender}</Text>
        <Text className='text-white'>{item.text}</Text>
      </View>
      <View className='flex-1'>
        <Text className='text-white'>{new Date(item.timestamp).toLocaleTimeString()}</Text>
      </View>
    </View>
  );

  return (
      <View>
        <View>
          <Text>Participants: {participants.join(', ')}</Text>
        </View>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index.toString()}
        />
        <View>
          <Input
            name="inputMessage"
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Type a message"
          />
          <Button title="Send" onPress={sendMessage} />
        </View>
      </View>
  );
};

export default ChatComponent;
