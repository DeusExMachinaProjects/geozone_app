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
import type {ActivityType} from './sessionStore';

export type {ActivityType, TrackingPoint, TrackingSnapshot} from './sessionStore';

export async function requestTrackingPermissions() {
  return ensureTrackingPermissions();
}

export async function requestBackgroundTrackingPermission() {
  return ensureBackgroundTrackingPermission();
}

export async function startNativeTracking(activityType: ActivityType) {
  await startTracker(activityType);

  try {
    await startTrackingBackgroundRunner(activityType);
  } catch (error) {
    console.warn(
      '[location] No se pudo iniciar el runner en segundo plano',
      error,
    );
  }

  return getTrackerSnapshot();
}

export async function pauseNativeTracking() {
  await pauseTracker();

  const snapshot = getTrackerSnapshot();

  try {
    if (snapshot.isActive) {
      await setTrackingBackgroundStatus('paused', snapshot.activityType);
    }
  } catch (error) {
    console.warn(
      '[location] No se pudo pausar el runner en segundo plano',
      error,
    );
  }

  return snapshot;
}

export async function resumeNativeTracking() {
  await resumeTracker();

  const snapshot = getTrackerSnapshot();

  try {
    if (snapshot.isActive) {
      await setTrackingBackgroundStatus('active', snapshot.activityType);
    }
  } catch (error) {
    console.warn(
      '[location] No se pudo reanudar el runner en segundo plano',
      error,
    );
  }

  return snapshot;
}

export async function stopNativeTracking() {
  const finalSnapshot = getTrackerSnapshot();

  try {
    await finishTracker();
  } finally {
    try {
      await stopTrackingBackgroundRunner();
    } catch (error) {
      console.warn(
        '[location] No se pudo detener el runner en segundo plano',
        error,
      );
    }
  }

  return finalSnapshot;
}

export async function getNativeTrackingSnapshot() {
  await hydrateTrackerFromStorage();
  return getTrackerSnapshot();
}

export function openNativeLocationSettings() {
  showDeviceLocationSettingsAlert();
}

export function openNativePermissionSettings() {
  showLocationPermissionSettingsAlert();
}