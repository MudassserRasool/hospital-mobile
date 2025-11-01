/**
 * Push Notification Service
 * Handles Expo push notifications
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Configure how notifications are handled when app is in foreground
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Register for push notifications and get Expo push token
 */
export const registerForPushNotifications = async (): Promise<string | null> => {
  try {
    // Check if running on physical device
    if (!Device.isDevice) {
      console.warn('Push notifications only work on physical devices');
      return null;
    }

    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Failed to get push notification permissions');
      return null;
    }

    // Get Expo push token
    const projectId = Constants.expoConfig?.extra?.eas?.projectId || 'your-project-id';
    const token = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    // Android-specific configuration
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token.data;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
};

/**
 * Add notification received listener (app in foreground)
 */
export const addNotificationReceivedListener = (
  callback: (notification: Notifications.Notification) => void
) => {
  return Notifications.addNotificationReceivedListener(callback);
};

/**
 * Add notification response listener (user taps notification)
 */
export const addNotificationResponseListener = (
  callback: (response: Notifications.NotificationResponse) => void
) => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};

/**
 * Schedule a local notification
 */
export const scheduleLocalNotification = async (
  title: string,
  body: string,
  data?: any,
  trigger?: Notifications.NotificationTriggerInput
) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
      },
      trigger: trigger || null, // null = immediate
    });
  } catch (error) {
    console.error('Error scheduling local notification:', error);
  }
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
};

/**
 * Get notification badge count
 */
export const getBadgeCount = async (): Promise<number> => {
  try {
    return await Notifications.getBadgeCountAsync();
  } catch (error) {
    console.error('Error getting badge count:', error);
    return 0;
  }
};

/**
 * Set notification badge count
 */
export const setBadgeCount = async (count: number) => {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error('Error setting badge count:', error);
  }
};

/**
 * Handle notification navigation based on notification type
 */
export const handleNotificationNavigation = (
  notification: Notifications.Notification | Notifications.NotificationResponse,
  navigation: any
) => {
  try {
    const data = 'notification' in notification 
      ? notification.notification.request.content.data 
      : notification.request.content.data;

    const type = data?.type;
    const appointmentId = data?.appointmentId;
    const leaveId = data?.leaveId;

    switch (type) {
      case 'appointment_confirmed':
      case 'appointment_reminder':
      case 'appointment_cancelled':
        if (appointmentId) {
          navigation.navigate('AppointmentDetails', { id: appointmentId });
        }
        break;

      case 'leave_approved':
      case 'leave_rejected':
        if (leaveId) {
          navigation.navigate('LeaveManagement');
        }
        break;

      case 'payment_received':
      case 'refund_processed':
        navigation.navigate('Wallet');
        break;

      default:
        // Navigate to notifications screen
        navigation.navigate('Notifications');
        break;
    }
  } catch (error) {
    console.error('Error handling notification navigation:', error);
  }
};

