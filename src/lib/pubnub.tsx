import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';

const createPubNubClient = (userId: string) => new PubNub({
  publishKey: process.env.EXPO_PUBLIC_PUBNUB_PUBLISH_KEY as string,
  subscribeKey: process.env.EXPO_PUBLIC_PUBNUB_SUBSCRIBE_KEY as string,
  secretKey: process.env.EXPO_PUBLIC_PUBNUB_SECRET_KEY as string,
  userId,
  presenceTimeout: 30
});

interface PubNubWrapperProps {
  userId: string | null;
  children: React.ReactNode;
}

export const PubNubWrapper = ({ children, userId }: PubNubWrapperProps) => (
  <PubNubProvider client={createPubNubClient(userId as string)}>
    {children}
  </PubNubProvider>
);