export function formatElapsedTime(elapsedMs: number) {
  const safeElapsedMs =
    Number.isFinite(elapsedMs) && elapsedMs > 0 ? elapsedMs : 0;

  const totalSeconds = Math.floor(safeElapsedMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map(value => String(value).padStart(2, '0'))
    .join(':');
}

// Alias para compatibilidad, por si en otra parte del proyecto aún usas el nombre viejo.
export const formatElapsedFromMs = formatElapsedTime;

export function formatDistanceKm(distanceMeters: number) {
  const safeDistance =
    Number.isFinite(distanceMeters) && distanceMeters > 0
      ? distanceMeters
      : 0;

  return `${(safeDistance / 1000).toFixed(2)} km`;
}

export function formatSpeedKmh(speedMps: number) {
  const safeSpeed = Number.isFinite(speedMps) && speedMps > 0 ? speedMps : 0;
  return `${(safeSpeed * 3.6).toFixed(1)} km/h`;
}

export function formatAscentMeters(ascentMeters: number) {
  const safeAscent =
    Number.isFinite(ascentMeters) && ascentMeters > 0 ? ascentMeters : 0;

  return `${Math.round(safeAscent)} m`;
}