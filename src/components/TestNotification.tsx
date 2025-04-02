import { Button } from '@/components/ui/button';
import { useGetSession } from '@/network/session';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export function TestNotification() {
  const { data: session } = useGetSession();
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

  useEffect(() => {
    checkNotificationSetup();
  }, []);

  const checkNotificationSetup = async () => {
    try {
      // Check permissions
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionStatus(status);
      console.log("Permission status:", status);

      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        setPermissionStatus(newStatus);
        console.log("New permission status:", newStatus);
      }

      // Get push token
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      });
      setPushToken(tokenData.data);
      console.log("Push token:", tokenData.data);
    } catch (error) {
      console.error("Error checking notification setup:", error);
    }
  };

  const testLocalNotification = async () => {
    console.log("Testing local notification");
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Local Test",
        body: "This is a test local notification",
        data: { type: "test" },
        sound: "default",
      },
      trigger: null,
    });
  };

  const testPushNotification = async () => {
    if (!session?.user?.id) {
      console.log("No user ID found");
      return;
    }

    console.log("Testing push notification for user:", session.user.id);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/handle-notifications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            type: "test",
            recipient_id: session.user.id,
            data: {
              message: "Test push notification",
              timestamp: new Date().toISOString(),
            },
          }),
        }
      );

      // Log the raw response first
      const rawText = await response.text();
      console.log("Raw response:", rawText);

      // Try to parse if it looks like JSON
      try {
        const result = JSON.parse(rawText);
        console.log("Push notification test result:", result);
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
      }
    } catch (error) {
      console.error("Push notification test error:", error);
    }
  };

  const testDelayedPushNotification = async () => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/handle-notifications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            type: "test",
            recipient_id: session.user.id,
            data: {
              message: "Delayed test notification",
              timestamp: new Date().toISOString(),
            },
          }),
        }
      );
      console.log("Delayed push notification sent");
    } catch (error) {
      console.error("Error sending delayed notification:", error);
    }
  };

  const testLocalDelayedNotification = async () => {
    console.log("Scheduling delayed local notification");
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Delayed Test",
        body: "This is a delayed test notification",
        data: { type: "test" },
        sound: "default",
      },
      trigger: {
        seconds: 5,
      },
    });
  };

  return (
    <View style={{ padding: 10, gap: 10 }}>
      <Text style={{ color: 'white' }}>
        Permission Status: {permissionStatus || 'checking...'}
      </Text>
      <Text style={{ color: 'white' }}>
        Push Token: {pushToken ? '✅' : '❌'}
      </Text>
      <Button
        variant="primary"
        onPress={testLocalNotification}
        label="Immediate Local"
      />
      <Button
        variant="primary"
        onPress={testLocalDelayedNotification}
        label="Delayed Local (5s)"
      />
      <Button
        variant="primary"
        onPress={testPushNotification}
        label="Push Notification"
      />
      <Button
        variant="primary"
        onPress={testDelayedPushNotification}
        label="Background Push"
      />
      <Button
        variant="secondary"
        onPress={checkNotificationSetup}
        label="Check Notification Setup"
      />
    </View>
  );
}
