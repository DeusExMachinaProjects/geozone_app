import type {LatLng} from 'react-native-maps';

export type PawPoint = {
  id: string;
  coordinate: LatLng;
  rotation: number;
};

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function toDeg(value: number) {
  return (value * 180) / Math.PI;
}

function getDistanceMeters(a: LatLng, b: LatLng) {
  const R = 6371000;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);

  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

function getBearing(a: LatLng, b: LatLng) {
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const dLng = toRad(b.longitude - a.longitude);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  const bearing = toDeg(Math.atan2(y, x));
  return (bearing + 360) % 360;
}

function interpolatePoint(a: LatLng, b: LatLng, t: number): LatLng {
  return {
    latitude: a.latitude + (b.latitude - a.latitude) * t,
    longitude: a.longitude + (b.longitude - a.longitude) * t,
  };
}

function offsetCoordinate(
  point: LatLng,
  bearingDegrees: number,
  offsetMeters: number,
): LatLng {
  const angle = toRad(bearingDegrees);

  const dLat = (offsetMeters * Math.cos(angle)) / 111111;
  const dLng =
    (offsetMeters * Math.sin(angle)) /
    (111111 * Math.cos(toRad(point.latitude)));

  return {
    latitude: point.latitude + dLat,
    longitude: point.longitude + dLng,
  };
}

export function buildPawTrail(
  coordinates: LatLng[],
  stepDistanceMeters = 10,
  lateralOffsetMeters = 0.8,
): PawPoint[] {
  if (coordinates.length < 2) {
    return [];
  }

  const paws: PawPoint[] = [];
  let distanceSinceLastPaw = 0;
  let side: 'left' | 'right' = 'left';
  let pawIndex = 0;

  for (let i = 1; i < coordinates.length; i++) {
    let segmentStart = coordinates[i - 1];
    const segmentEnd = coordinates[i];

    let segmentDistance = getDistanceMeters(segmentStart, segmentEnd);

    if (segmentDistance < 2) {
      continue;
    }

    const rotation = getBearing(segmentStart, segmentEnd);

    while (distanceSinceLastPaw + segmentDistance >= stepDistanceMeters) {
      const needed = stepDistanceMeters - distanceSinceLastPaw;
      const t = needed / segmentDistance;

      const basePoint = interpolatePoint(segmentStart, segmentEnd, t);

      const sideBearing = side === 'left' ? rotation - 90 : rotation + 90;
      const shiftedPoint = offsetCoordinate(
        basePoint,
        sideBearing,
        lateralOffsetMeters,
      );

      paws.push({
        id: `paw-${pawIndex++}`,
        coordinate: shiftedPoint,
        rotation,
      });

      side = side === 'left' ? 'right' : 'left';
      segmentStart = basePoint;
      segmentDistance = getDistanceMeters(segmentStart, segmentEnd);
      distanceSinceLastPaw = 0;
    }

    distanceSinceLastPaw += segmentDistance;
  }

  return paws;
}