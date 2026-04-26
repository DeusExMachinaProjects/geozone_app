import AsyncStorage from '@react-native-async-storage/async-storage';
import type {ActivityType, TrackingPoint} from '../../features/tracking/types';

const TRACKING_SESSION_KEY = '@geozone/tracking-session:v1';

export type TrackingSessionSnapshot = {
  isActive: boolean;
  isPaused: boolean;
  isFinished: boolean;
  activityType: ActivityType;
  startedAt: number | null;
  pausedAt: number | null;
  pausedAt: number | null;
  finishedAt: number | null;
  totalPausedMs: number;
  elapsedMs: number;
  distanceMeters: number;
  speedMps: number;
  ascentMeters: number;
  altitudeMeters?: number | null;
  hasLocation: boolean;
  errorCode?: string | null;
  location: TrackingPoint | null;
  route: TrackingPoint[];
};

export function createIdleTrackingSnapshot(
  activityType: ActivityType = 'run',
): TrackingSessionSnapshot {
  return {
    isActive: false,
    isPaused: false,
    isFinished: false,
    activityType,
    startedAt: null,
    pausedAt: null,
    finishedAt: null,
    totalPausedMs: 0,
    elapsedMs: 0,
    distanceMeters: 0,
    speedMps: 0,
    ascentMeters: 0,
    altitudeMeters: null,
    hasLocation: false,
    errorCode: null,
    location: null,
    route: [],
  };
}

export async function saveTrackingSession(snapshot: TrackingSessionSnapshot) {
  await AsyncStorage.setItem(TRACKING_SESSION_KEY, JSON.stringify(snapshot));
}

export async function loadTrackingSession(): Promise<TrackingSessionSnapshot | null> {
  const raw = await AsyncStorage.getItem(TRACKING_SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as TrackingSessionSnapshot;
  } catch {
    await AsyncStorage.removeItem(TRACKING_SESSION_KEY);
    return null;
  }
}

export async function clearTrackingSession() {
  await AsyncStorage.removeItem(TRACKING_SESSION_KEY);
}
