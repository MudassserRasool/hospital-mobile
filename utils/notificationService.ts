/**
 * Push Notification Service
 * Handles Expo push notifications
 * Uses dynamic imports to avoid errors in Expo Go
 */

import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

/**
 * Check if running in Expo Go
 */
const isExpoGo = Constants.executionEnvironment === 'storeClient';

/**
 * Lazy load expo-notifications only when needed (not in Expo Go)
 */
let Notifications: typeof import('expo-notifications') | null = null;

const loadNotifications = async () => {
  if (isExpoGo) {
    return null;
  }
  if (!Notifications) {
    try {
      Notifications = await import('expo-notifications');
      // Configure notification handler
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
    } catch (error) {
      console.warn('Failed to load expo-notifications:', error);
      return null;
    }
  }
  return Notifications;
};

/**
 * Register for push notifications and get Expo push token
 */
export const registerForPushNotifications = async (): Promise<
  string | null
> => {
  try {
    // Push notifications are not supported in Expo Go
    if (isExpoGo) {
      console.warn(
        'Push notifications are not supported in Expo Go. Use a development build instead.'
      );
      return null;
    }

    const NotificationsModule = await loadNotifications();
    if (!NotificationsModule) {
      return null;
    }

    // Check if running on physical device
    if (!Device.isDevice) {
      console.warn('Push notifications only work on physical devices');
      return null;
    }

    // Request permissions
    const { status: existingStatus } =
      await NotificationsModule.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await NotificationsModule.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Failed to get push notification permissions');
      return null;
    }

    // Get Expo push token
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId || 'your-project-id';
    const token = await NotificationsModule.getExpoPushTokenAsync({
      projectId,
    });

    // Android-specific configuration
    if (Platform.OS === 'android') {
      await NotificationsModule.setNotificationChannelAsync('default', {
        name: 'default',
        importance: NotificationsModule.AndroidImportance.MAX,
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
export const addNotificationReceivedListener = async (
  callback: (notification: any) => void
) => {
  if (isExpoGo) {
    console.warn('Notification listeners are not supported in Expo Go');
    return { remove: () => {} };
  }
  try {
    const NotificationsModule = await loadNotifications();
    if (!NotificationsModule) {
      return { remove: () => {} };
    }
    return NotificationsModule.addNotificationReceivedListener(callback);
  } catch (error) {
    console.warn('Failed to add notification received listener:', error);
    return { remove: () => {} };
  }
};

/**
 * Add notification response listener (user taps notification)
 */
export const addNotificationResponseListener = async (
  callback: (response: any) => void
) => {
  if (isExpoGo) {
    console.warn('Notification listeners are not supported in Expo Go');
    return { remove: () => {} };
  }
  try {
    const NotificationsModule = await loadNotifications();
    if (!NotificationsModule) {
      return { remove: () => {} };
    }
    return NotificationsModule.addNotificationResponseReceivedListener(
      callback
    );
  } catch (error) {
    console.warn('Failed to add notification response listener:', error);
    return { remove: () => {} };
  }
};

/**
 * Schedule a local notification
 */
export const scheduleLocalNotification = async (
  title: string,
  body: string,
  data?: any,
  trigger?: any
) => {
  if (isExpoGo) {
    console.warn('Local notifications are not fully supported in Expo Go');
    return;
  }
  try {
    const NotificationsModule = await loadNotifications();
    if (!NotificationsModule) {
      return;
    }
    await NotificationsModule.scheduleNotificationAsync({
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
  if (isExpoGo) {
    return;
  }
  try {
    const NotificationsModule = await loadNotifications();
    if (!NotificationsModule) {
      return;
    }
    await NotificationsModule.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
};

/**
 * Get notification badge count
 */
export const getBadgeCount = async (): Promise<number> => {
  if (isExpoGo) {
    return 0;
  }
  try {
    const NotificationsModule = await loadNotifications();
    if (!NotificationsModule) {
      return 0;
    }
    return await NotificationsModule.getBadgeCountAsync();
  } catch (error) {
    console.error('Error getting badge count:', error);
    return 0;
  }
};

/**
 * Set notification badge count
 */
export const setBadgeCount = async (count: number) => {
  if (isExpoGo) {
    return;
  }
  try {
    const NotificationsModule = await loadNotifications();
    if (!NotificationsModule) {
      return;
    }
    await NotificationsModule.setBadgeCountAsync(count);
  } catch (error) {
    console.error('Error setting badge count:', error);
  }
};

/**
 * Handle notification navigation based on notification type
 */
export const handleNotificationNavigation = (
  notification: any,
  navigation: any
) => {
  try {
    const data =
      'notification' in notification
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
