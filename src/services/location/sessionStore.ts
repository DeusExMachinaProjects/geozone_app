import AsyncStorage from '@react-native-async-storage/async-storage';

import type {ActivityType, TrackingPoint} from '../../features/tracking/types';

export type {ActivityType, TrackingPoint};

const TRACKING_SESSION_KEY = '@geozone/tracking-session:v1';

export type TrackingSnapshot = {
  isActive: boolean;
  isPaused: boolean;
  isFinished: boolean;

  activityType: ActivityType;

  startedAt: number | null;
  pausedAt: number | null;
  finishedAt: number | null;
  lastUpdatedAt: number | null;

  totalPausedMs: number;
  elapsedMs: number;

  distanceMeters: number;
  speedMps: number;
  ascentMeters: number;

  altitudeMeters?: number | null;

  hasLocation: boolean;
  errorCode?: string | null;

  lastPoint: TrackingPoint | null;
  location: TrackingPoint | null;

  route: TrackingPoint[];
};

export type TrackingSessionSnapshot = TrackingSnapshot;

const isActivityType = (value: unknown): value is ActivityType => {
  return value === 'run' || value === 'ride' || value === 'pet';
};

const toNumber = (value: unknown, fallback = 0): number => {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
};

const toNullableNumber = (value: unknown): number | null => {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
};

const normalizeTrackingPoint = (value: unknown): TrackingPoint | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const point = value as Partial<TrackingPoint>;

  const latitude = toNullableNumber(point.latitude);
  const longitude = toNullableNumber(point.longitude);

  if (latitude === null || longitude === null) {
    return null;
  }

  return {
    latitude,
    longitude,
    timestamp: toNumber(point.timestamp, Date.now()),
    accuracy: toNullableNumber(point.accuracy),
    altitude: toNullableNumber(point.altitude),
    altitudeAccuracy: toNullableNumber(point.altitudeAccuracy),
    heading: toNullableNumber(point.heading),
    speed: toNullableNumber(point.speed),
  };
};

export function createIdleTrackingSnapshot(
  activityType: ActivityType = 'run',
): TrackingSnapshot {
  return {
    isActive: false,
    isPaused: false,
    isFinished: false,

    activityType,

    startedAt: null,
    pausedAt: null,
    finishedAt: null,
    lastUpdatedAt: null,

    totalPausedMs: 0,
    elapsedMs: 0,

    distanceMeters: 0,
    speedMps: 0,
    ascentMeters: 0,

    altitudeMeters: null,

    hasLocation: false,
    errorCode: null,

    lastPoint: null,
    location: null,

    route: [],
  };
}

function normalizeSnapshot(
  value: Partial<TrackingSnapshot> | null,
): TrackingSnapshot | null {
  if (!value) {
    return null;
  }

  const activityType = isActivityType(value.activityType)
    ? value.activityType
    : 'run';

  const idle = createIdleTrackingSnapshot(activityType);

  const rawRoute = Array.isArray(value.route) ? value.route : [];
  const route = rawRoute
    .map(normalizeTrackingPoint)
    .filter((point): point is TrackingPoint => Boolean(point));

  const lastPoint =
    normalizeTrackingPoint(value.lastPoint) ??
    normalizeTrackingPoint(value.location) ??
    route[route.length - 1] ??
    null;

  const location = normalizeTrackingPoint(value.location) ?? lastPoint;

  return {
    ...idle,
    ...value,

    activityType,

    isActive: Boolean(value.isActive),
    isPaused: Boolean(value.isPaused),
    isFinished: Boolean(value.isFinished),

    startedAt: toNullableNumber(value.startedAt),
    pausedAt: toNullableNumber(value.pausedAt),
    finishedAt: toNullableNumber(value.finishedAt),
    lastUpdatedAt: toNullableNumber(value.lastUpdatedAt),

    totalPausedMs: toNumber(value.totalPausedMs),
    elapsedMs: toNumber(value.elapsedMs),

    distanceMeters: toNumber(value.distanceMeters),
    speedMps: toNumber(value.speedMps),
    ascentMeters: toNumber(value.ascentMeters),

    altitudeMeters:
      toNullableNumber(value.altitudeMeters) ??
      toNullableNumber(location?.altitude) ??
      null,

    hasLocation: Boolean(location),
    errorCode: value.errorCode ?? null,

    lastPoint,
    location,
    route,
  };
}

export async function saveTrackingSession(snapshot: TrackingSnapshot) {
  await AsyncStorage.setItem(TRACKING_SESSION_KEY, JSON.stringify(snapshot));
}

export async function loadTrackingSession(): Promise<TrackingSnapshot | null> {
  const raw = await AsyncStorage.getItem(TRACKING_SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<TrackingSnapshot>;
    return normalizeSnapshot(parsed);
  } catch {
    await AsyncStorage.removeItem(TRACKING_SESSION_KEY);
    return null;
  }
}

export async function clearTrackingSession() {
  await AsyncStorage.removeItem(TRACKING_SESSION_KEY);
}