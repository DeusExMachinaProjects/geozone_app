import notifee from '@notifee/react-native';
import {Platform} from 'react-native';
import {requestNotifications, RESULTS} from 'react-native-permissions';
import {GEOZONE_CHANNELS, ensureNotificationChannels} from './channels';

export type BusinessNotificationCategory =
  | 'missions'
  | 'community'
  | 'system'
  | 'pets';

function getChannelId(category: BusinessNotificationCategory) {
  switch (category) {
    case 'missions':
      return GEOZONE_CHANNELS.missions;
    case 'community':
      return GEOZONE_CHANNELS.community;
    case 'pets':
      return GEOZONE_CHANNELS.pets;
    default:
      return GEOZONE_CHANNELS.default;
  }
}

export async function ensureBusinessNotificationPermission() {
  if (Platform.OS === 'android' && Number(Platform.Version) < 33) {
    return true;
  }

  const {status} = await requestNotifications(['alert', 'sound']);

  return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
}

export async function sendBusinessNotification(params: {
  title: string;
  body: string;
  category?: BusinessNotificationCategory;
  notificationId?: number;
}) {
  const granted = await ensureBusinessNotificationPermission();

  if (!granted) {
    throw new Error('Permiso de notificaciones no concedido.');
  }

  await ensureNotificationChannels();

  await notifee.displayNotification({
    id: String(params.notificationId ?? Date.now()),
    title: params.title,
    body: params.body,
    android: {
      channelId: getChannelId(params.category ?? 'system'),
      pressAction: {
        id: 'default',
      },
    },
    ios: {
      sound: 'default',
    },
  });

  return true;
}
