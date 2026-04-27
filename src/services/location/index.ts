import {
  finishTracker,
  getTrackerSnapshot,
  hydrateTrackerFromStorage,
  pauseTracker,
  resumeTracker,
  startTracker,
} from './tracker';
import {
  setTrackingBackgroundStatus,
  startTrackingBackgroundRunner,
  stopTrackingBackgroundRunner,
} from './backgroundRunner';
import {
  ensureBackgroundTrackingPermission,
  ensureTrackingPermissions,
  showDeviceLocationSettingsAlert,
  showLocationPermissionSettingsAlert,
} from './permissions';

import type {
  ActivityType,
  TrackingPoint,
  TrackingSnapshot,
} from './sessionStore';

export type {ActivityType, TrackingPoint, TrackingSnapshot} from './sessionStore';

export type ActivityTrackingStatus =
  | 'idle'
  | 'tracking'
  | 'paused'
  | 'finished';

export type ActivityTrackingSnapshot = {
  activityType: ActivityType | null;
  status: ActivityTrackingStatus;
  startedAt: number | null;
  distanceMeters: number;
  durationMs: number;
  currentSpeedMps: number;
  ascentMeters: number;
  currentAltitudeMeters: number | null;
  route: TrackingPoint[];
  lastLocation: TrackingPoint | null;
  errorCode?: string | null;
};

let hasHydratedTracker = false;

async function ensureHydratedTracker() {
  if (hasHydratedTracker) {
    return;
  }

  await hydrateTrackerFromStorage();
  hasHydratedTracker = true;
}

function getTrackingStatus(snapshot: TrackingSnapshot): ActivityTrackingStatus {
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
  snapshot: TrackingSnapshot,
): ActivityTrackingSnapshot {
  const lastLocation = snapshot.location ?? snapshot.lastPoint ?? null;

  return {
    activityType: snapshot.activityType ?? null,
    status: getTrackingStatus(snapshot),
    startedAt: snapshot.startedAt,
    distanceMeters: Number(snapshot.distanceMeters ?? 0),
    durationMs: Number(snapshot.elapsedMs ?? 0),
    currentSpeedMps: Number(snapshot.speedMps ?? 0),
    ascentMeters: Number(snapshot.ascentMeters ?? 0),
    currentAltitudeMeters:
      snapshot.altitudeMeters ??
      snapshot.location?.altitude ??
      snapshot.lastPoint?.altitude ??
      null,
    route: Array.isArray(snapshot.route) ? snapshot.route : [],
    lastLocation,
    errorCode: snapshot.errorCode ?? null,
  };
}

export async function requestTrackingPermissions() {
  return ensureTrackingPermissions();
}

export async function requestBackgroundTrackingPermission() {
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
  await startTracker(activityType);

  try {
    await startTrackingBackgroundRunner(activityType);
  } catch (error) {
    if (__DEV__) {
      console.warn(
        '[location] No se pudo iniciar el runner en segundo plano',
        error,
      );
    }
  }

  return toActivityTrackingSnapshot(getTrackerSnapshot());
}

export async function pauseNativeTracking(): Promise<ActivityTrackingSnapshot> {
  await ensureHydratedTracker();
  await pauseTracker();

  const snapshot = getTrackerSnapshot();

  try {
    if (snapshot.isActive) {
      await setTrackingBackgroundStatus('paused', snapshot.activityType);
    }
  } catch (error) {
    if (__DEV__) {
      console.warn(
        '[location] No se pudo pausar el runner en segundo plano',
        error,
      );
    }
  }

  return toActivityTrackingSnapshot(snapshot);
}

export async function resumeNativeTracking(): Promise<ActivityTrackingSnapshot> {
  await ensureHydratedTracker();
  await resumeTracker();

  const snapshot = getTrackerSnapshot();

  try {
    if (snapshot.isActive) {
      await setTrackingBackgroundStatus('active', snapshot.activityType);
    }
  } catch (error) {
    if (__DEV__) {
      console.warn(
        '[location] No se pudo reanudar el runner en segundo plano',
        error,
      );
    }
  }

  return toActivityTrackingSnapshot(snapshot);
}

export async function stopNativeTracking(): Promise<ActivityTrackingSnapshot> {
  await ensureHydratedTracker();

  try {
    await finishTracker();
  } finally {
    try {
      await stopTrackingBackgroundRunner();
    } catch (error) {
      if (__DEV__) {
        console.warn(
          '[location] No se pudo detener el runner en segundo plano',
          error,
        );
      }
    }
  }

  return toActivityTrackingSnapshot(getTrackerSnapshot());
}

export async function getNativeTrackingSnapshot(): Promise<ActivityTrackingSnapshot> {
  await ensureHydratedTracker();
  return toActivityTrackingSnapshot(getTrackerSnapshot());
}

export function openNativeLocationSettings() {
  showDeviceLocationSettingsAlert();
}

export function openNativePermissionSettings() {
  showLocationPermissionSettingsAlert();
}