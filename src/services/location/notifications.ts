import notifee, {
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import type {ActivityType} from './sessionStore';

export type TrackingNotificationPayload = {
  notificationId?: string;
  channelId?: string;
  activityType?: ActivityType;
  elapsedMs: number;
  distanceMeters: number;
  speedMps: number;
  ascentMeters: number;
  isPaused?: boolean;
};

const DEFAULT_TRACKING_CHANNEL_ID = 'geozone-tracking';
const DEFAULT_TRACKING_NOTIFICATION_ID = 'geozone-tracking-active';

function formatDistance(distanceMeters: number): string {
  const safe = Number.isFinite(distanceMeters) ? Math.max(0, distanceMeters) : 0;

  return safe >= 1000
    ? `${(safe / 1000).toFixed(2)} km`
    : `${Math.round(safe)} m`;
}

function formatSpeed(speedMps: number): string {
  const safe = Number.isFinite(speedMps) ? Math.max(0, speedMps) : 0;
  return `${(safe * 3.6).toFixed(1)} km/h`;
}

function formatElapsed(elapsedMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':');
}

function getActivityLabel(activityType?: ActivityType): string {
  switch (activityType) {
    case 'ride':
      return 'bicicleta';
    case 'pet':
      return 'mascotas';
    case 'run':
    default:
      return 'actividad';
  }
}

export async function ensureNotificationChannel(
  channelId: string = DEFAULT_TRACKING_CHANNEL_ID,
): Promise<string> {
  return notifee.createChannel({
    id: channelId,
    name: 'Seguimiento activo',
    importance: AndroidImportance.LOW,
    vibration: false,
    lights: false,
    badge: false,
  });
}

export async function showTrackingNotification(
  payload: TrackingNotificationPayload,
): Promise<void> {
  const notificationId =
    payload.notificationId ?? DEFAULT_TRACKING_NOTIFICATION_ID;
  const channelId = payload.channelId ?? DEFAULT_TRACKING_CHANNEL_ID;
  const activityLabel = getActivityLabel(payload.activityType);

  const title = payload.isPaused
    ? `GeoZone · ${activityLabel} pausada`
    : `GeoZone · ${activityLabel} activa`;

  const body = [
    `Distancia ${formatDistance(payload.distanceMeters)}`,
    `Tiempo ${formatElapsed(payload.elapsedMs)}`,
    `Velocidad ${formatSpeed(payload.speedMps)}`,
    `Ascenso ${Math.max(0, Math.round(payload.ascentMeters))} m`,
  ].join(' · ');

  await ensureNotificationChannel(channelId);

  await notifee.displayNotification({
    id: notificationId,
    title,
    body,
    android: {
      channelId,
      asForegroundService: true,
      ongoing: true,
      autoCancel: false,
      onlyAlertOnce: true,
      smallIcon: 'ic_launcher',
      importance: AndroidImportance.LOW,
      visibility: AndroidVisibility.PUBLIC,
      showChronometer: false,
      pressAction: {
        id: 'default',
      },
    },
  });
}

export async function clearTrackingNotification(
  notificationId: string = DEFAULT_TRACKING_NOTIFICATION_ID,
): Promise<void> {
  try {
    await notifee.stopForegroundService();
  } catch {}

  try {
    await notifee.cancelDisplayedNotification(notificationId);
  } catch {}

  try {
    await notifee.cancelNotification(notificationId);
  } catch {}
}

export const cancelTrackingNotification = clearTrackingNotification;