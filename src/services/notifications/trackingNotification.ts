import type {ActivityType} from '../../features/tracking/types';

const ACTIVITY_LABELS: Record<ActivityType, string> = {
  run: 'Carrera en curso',
  ride: 'Bicicleta en curso',
  pet: 'Paseo de mascota en curso',
};

const ACTIVITY_DESCRIPTIONS: Record<ActivityType, string> = {
  run: 'Toca para volver a GeoZone y finalizar la carrera.',
  ride: 'Toca para volver a GeoZone y finalizar la ruta en bicicleta.',
  pet: 'Toca para volver a GeoZone y finalizar el paseo.',
};

const ACTIVITY_LINKS: Record<ActivityType, string> = {
  run: 'geozone://tracking/run',
  ride: 'geozone://tracking/ride',
  pet: 'geozone://tracking/pet',
};

export function buildTrackingBackgroundOptions(activityType: ActivityType) {
  return {
    taskName: 'GeoZone Tracking',
    taskTitle: ACTIVITY_LABELS[activityType],
    taskDesc: ACTIVITY_DESCRIPTIONS[activityType],
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#FF6B52',
    linkingURI: ACTIVITY_LINKS[activityType],
    parameters: {
      delayMs: 15000,
    },
    foregroundServiceType: 'location',
  };
}

export function buildTrackingBackgroundUpdate(params: {
  activityType: ActivityType;
  distanceKm?: string;
  elapsedLabel?: string;
  speedKmh?: string;
}) {
  const distance = params.distanceKm ? `${params.distanceKm} km` : 'GPS activo';
  const time = params.elapsedLabel ? ` · ${params.elapsedLabel}` : '';
  const speed = params.speedKmh ? ` · ${params.speedKmh} km/h` : '';

  return {
    taskDesc: `${distance}${time}${speed}. Toca para volver y finalizar.`,
  };
}
