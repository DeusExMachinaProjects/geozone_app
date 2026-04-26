import notifee, {AndroidImportance} from '@notifee/react-native';
import {Platform} from 'react-native';

export const GEOZONE_CHANNELS = {
  default: 'geozone-default',
  missions: 'geozone-missions',
  community: 'geozone-community',
  pets: 'geozone-pets',
} as const;

let channelsReady = false;

export async function ensureNotificationChannels() {
  if (channelsReady || Platform.OS !== 'android') {
    channelsReady = true;
    return GEOZONE_CHANNELS;
  }

  await Promise.all([
    notifee.createChannel({
      id: GEOZONE_CHANNELS.default,
      name: 'GeoZone general',
      importance: AndroidImportance.HIGH,
    }),
    notifee.createChannel({
      id: GEOZONE_CHANNELS.missions,
      name: 'GeoZone misiones',
      importance: AndroidImportance.HIGH,
    }),
    notifee.createChannel({
      id: GEOZONE_CHANNELS.community,
      name: 'GeoZone comunidad',
      importance: AndroidImportance.DEFAULT,
    }),
    notifee.createChannel({
      id: GEOZONE_CHANNELS.pets,
      name: 'GeoZone mascotas',
      importance: AndroidImportance.DEFAULT,
    }),
  ]);

  channelsReady = true;
  return GEOZONE_CHANNELS;
}
