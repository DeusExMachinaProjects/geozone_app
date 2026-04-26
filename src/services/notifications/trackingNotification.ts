import type {ActivityType} from '../../features/tracking/types';

type BackgroundNotificationOptions = {
  taskName: string;
  taskTitle: string;
  taskDesc: string;
  taskIcon: {
    name: string;
    type: 'mipmap' | 'drawable';
  };
  color: string;
  linkingURI: string;
  parameters: {
    delayMs: number;
  };
  foregroundServiceType: Array<'location'>;
};

type BackgroundNotificationUpdate = {
  taskTitle: string;
  taskDesc: string;
};

function getActivityLabel(activityType: ActivityType) {
  switch (activityType) {
    case 'run':
      return 'Running';
    case 'ride':
      return 'Ciclismo';
    case 'pet':
      return 'Mascotas';
    default:
      return 'Actividad';
  }
}

export function buildTrackingBackgroundOptions(
  activityType: ActivityType,
): BackgroundNotificationOptions {
  const label = getActivityLabel(activityType);

  return {
    taskName: 'GeoZoneTracking',
    taskTitle: `GeoZone · ${label}`,
    taskDesc: 'Preparando seguimiento en segundo plano',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#FF6B52',
    linkingURI: 'geozone://tracking',
    parameters: {
      delayMs: 15000,
    },
    // Esto es lo que evita el crash en Android 14+ / targetSdk altos.
    foregroundServiceType: ['location'],
  };
}

export function buildTrackingBackgroundUpdate(
  activityType: ActivityType,
  description: string,
): BackgroundNotificationUpdate {
  return {
    taskTitle: `GeoZone · ${getActivityLabel(activityType)}`,
    taskDesc: description,
  };
}