import type {TrackingPoint} from '../types';

export function formatElapsedFromMs(elapsedMs: number) {
  const safeMs = Math.max(0, elapsedMs);
  const totalSeconds = Math.floor(safeMs / 1000);

  const hrs = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, '0');
  const mins = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');

  return `${hrs}:${mins}:${secs}`;
}

export function formatDistanceKm(meters: number) {
  return (Math.max(0, meters) / 1000).toFixed(2);
}

export function formatSpeedKmh(speedMps: number) {
  return (Math.max(0, speedMps) * 3.6).toFixed(1);
}

export function deriveErrorMessage(errorCode?: string | null) {
  switch (errorCode) {
    case 'gps_disabled':
      return 'Sin GPS. Activa la ubicación para continuar.';
    case 'permission_denied':
      return 'Permiso de ubicación requerido. Acepta el acceso al GPS para iniciar o reanudar la actividad.';
    case 'location_unavailable':
      return 'Buscando ubicación...';
    case 'service_unavailable':
      return 'El servicio de seguimiento no está disponible.';
    default:
      return null;
  }
}

export function isSamePoint(
  first: TrackingPoint | null,
  second: TrackingPoint | null,
) {
  if (!first && !second) {
    return true;
  }

  if (!first || !second) {
    return false;
  }

  return (
    first.latitude === second.latitude &&
    first.longitude === second.longitude &&
    first.timestamp === second.timestamp
  );
}