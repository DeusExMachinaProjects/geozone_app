import {
  clearTrackingSession,
  finishTracking,
  getTrackingSnapshot,
  loadTrackingSnapshot,
  pauseTracking,
  resumeTracking,
  startTracking,
  stopTracking,
  subscribeTrackingSnapshot,
  type TrackingLocation,
  type TrackingSnapshot,
} from './tracker';

import {
  ensureBackgroundTrackingPermission,
  ensureTrackingPermissions,
  showDeviceLocationSettingsAlert,
  showLocationPermissionSettingsAlert,
} from './permissions';

import type {ActivityType} from './backgroundRunner';

export type {ActivityType} from './backgroundRunner';

export type TrackingPoint = TrackingLocation;

export type ActivityTrackingStatus =
  | 'idle'
  | 'tracking'
  | 'paused'
  | 'finished';

export type ActivityTrackingSnapshot = {
  activityType: ActivityType | null;
  status: ActivityTrackingStatus;
  startedAt: number | null;
  finishedAt: number | null;
  distanceMeters: number;
  durationMs: number;
  elapsedMs: number;
  currentSpeedMps: number;
  speedMps: number;
  speedKmh: number;
  ascentMeters: number;
  currentAltitudeMeters: number | null;
  altitudeMeters: number | null;
  route: TrackingPoint[];
  lastLocation: TrackingPoint | null;
  location: TrackingPoint | null;
  isActive: boolean;
  isPaused: boolean;
  isFinished: boolean;
  errorCode?: string | null;
};

let hydrationPromise: Promise<TrackingSnapshot | null> | null = null;
let hasHydratedTracker = false;

function getTrackingStatus(
  snapshot: TrackingSnapshot | null,
): ActivityTrackingStatus {
  if (!snapshot) {
    return 'idle';
  }

  if (snapshot.isFinished) {
    return 'finished';
  }

  if (snapshot.isPaused) {
    return 'paused';
  }

  if (snapshot.isActive) {
    return 'tracking';
  }

  return 'idle';
}

function toActivityTrackingSnapshot(
  snapshot: TrackingSnapshot | null,
): ActivityTrackingSnapshot {
  const lastLocation = snapshot?.lastLocation ?? null;

  return {
    activityType: snapshot?.activityType ?? null,
    status: getTrackingStatus(snapshot),
    startedAt: snapshot?.startedAt ?? null,
    finishedAt: snapshot?.finishedAt ?? null,

    distanceMeters: Number(snapshot?.distanceMeters ?? 0),

    durationMs: Number(snapshot?.elapsedMs ?? 0),
    elapsedMs: Number(snapshot?.elapsedMs ?? 0),

    currentSpeedMps: Number(snapshot?.speedMps ?? 0),
    speedMps: Number(snapshot?.speedMps ?? 0),
    speedKmh: Number(snapshot?.speedKmh ?? 0),

    ascentMeters: Number(snapshot?.ascentMeters ?? 0),

    currentAltitudeMeters:
      snapshot?.altitudeMeters ?? snapshot?.lastLocation?.altitude ?? null,

    altitudeMeters:
      snapshot?.altitudeMeters ?? snapshot?.lastLocation?.altitude ?? null,

    route: Array.isArray(snapshot?.route) ? snapshot.route : [],

    lastLocation,
    location: lastLocation,

    isActive: Boolean(snapshot?.isActive),
    isPaused: Boolean(snapshot?.isPaused),
    isFinished: Boolean(snapshot?.isFinished),

    errorCode: null,
  };
}

export async function ensureHydratedTracker(): Promise<void> {
  if (hasHydratedTracker) {
    return;
  }

  if (!hydrationPromise) {
    hydrationPromise = loadTrackingSnapshot();
  }

  try {
    await hydrationPromise;
    hasHydratedTracker = true;
  } catch (error) {
    hydrationPromise = null;
    hasHydratedTracker = false;

    if (__DEV__) {
      console.warn('[location] No se pudo hidratar el tracker', error);
    }
  }
}

export async function requestTrackingPermissions(): Promise<boolean> {
  return ensureTrackingPermissions();
}

export async function requestBackgroundTrackingPermission(): Promise<boolean> {
  return ensureBackgroundTrackingPermission();
}

export async function startNativeTracking(
  activityType: ActivityType,
): Promise<ActivityTrackingSnapshot | null> {
  const hasPermissions = await ensureTrackingPermissions();

  if (!hasPermissions) {
    return null;
  }

  await ensureHydratedTracker();

  const snapshot = await startTracking(activityType);

  return toActivityTrackingSnapshot(snapshot);
}

export async function pauseNativeTracking(): Promise<ActivityTrackingSnapshot> {
  await ensureHydratedTracker();

  const snapshot = await pauseTracking();

  return toActivityTrackingSnapshot(snapshot ?? getTrackingSnapshot());
}

export async function resumeNativeTracking(): Promise<ActivityTrackingSnapshot> {
  await ensureHydratedTracker();

  const snapshot = await resumeTracking();

  return toActivityTrackingSnapshot(snapshot ?? getTrackingSnapshot());
}

export async function finishNativeTracking(): Promise<ActivityTrackingSnapshot> {
  await ensureHydratedTracker();

  const snapshot = await finishTracking();

  return toActivityTrackingSnapshot(snapshot ?? getTrackingSnapshot());
}

export async function stopNativeTracking(): Promise<ActivityTrackingSnapshot> {
  await ensureHydratedTracker();

  const snapshot = await finishTracking();

  return toActivityTrackingSnapshot(snapshot ?? getTrackingSnapshot());
}

export async function clearNativeTrackingSession(): Promise<void> {
  await stopTracking();

  hydrationPromise = null;
  hasHydratedTracker = false;
}

export async function clearTracking(): Promise<void> {
  await clearTrackingSession();

  hydrationPromise = null;
  hasHydratedTracker = false;
}

export async function getNativeTrackingSnapshot(): Promise<ActivityTrackingSnapshot> {
  await ensureHydratedTracker();

  return toActivityTrackingSnapshot(getTrackingSnapshot());
}

export function getCurrentTrackingSnapshot(): ActivityTrackingSnapshot {
  return toActivityTrackingSnapshot(getTrackingSnapshot());
}

export function subscribeNativeTrackingSnapshot(
  listener: (snapshot: ActivityTrackingSnapshot) => void,
): () => void {
  return subscribeTrackingSnapshot(snapshot => {
    listener(toActivityTrackingSnapshot(snapshot));
  });
}

export function openNativeLocationSettings(): void {
  showDeviceLocationSettingsAlert();
}

export function openNativePermissionSettings(): void {
  showLocationPermissionSettingsAlert();
}