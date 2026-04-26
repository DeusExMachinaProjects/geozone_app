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

  const activityType = value.activityType ?? 'run';
  const idle = createIdleTrackingSnapshot(activityType);

  const lastPoint = value.lastPoint ?? value.location ?? null;
  const location = value.location ?? lastPoint;

  return {
    ...idle,
    ...value,

    activityType,

    startedAt: value.startedAt ?? null,
    pausedAt: value.pausedAt ?? null,
    finishedAt: value.finishedAt ?? null,
    lastUpdatedAt: value.lastUpdatedAt ?? null,

    totalPausedMs: value.totalPausedMs ?? 0,
    elapsedMs: value.elapsedMs ?? 0,

    distanceMeters: value.distanceMeters ?? 0,
    speedMps: value.speedMps ?? 0,
    ascentMeters: value.ascentMeters ?? 0,

    altitudeMeters: value.altitudeMeters ?? location?.altitude ?? null,

    hasLocation: Boolean(location),
    errorCode: value.errorCode ?? null,

    lastPoint,
    location,

    route: Array.isArray(value.route) ? value.route : [],
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
    return normalizeSnapshot(JSON.parse(raw));
  } catch {
    await AsyncStorage.removeItem(TRACKING_SESSION_KEY);
    return null;
  }
}

export async function clearTrackingSession() {
  await AsyncStorage.removeItem(TRACKING_SESSION_KEY);
}