import {
  clearTrackingSession,
  finishTracking,
  getTrackingSnapshot,
  loadTrackingSnapshot,
  pauseTracking,
  requestTrackingPermissions,
  resumeTracking,
  startTracking,
  stopTracking,
  subscribeTrackingSnapshot,
  type TrackingSnapshot,
} from './tracker';

import {
  getLastTrackingBackgroundSnapshot,
  isTrackingBackgroundRunnerStarted,
  setTrackingBackgroundStatus,
  startTrackingBackgroundRunner,
  stopTrackingBackgroundRunner,
  updateTrackingBackgroundRunner,
  type ActivityType,
} from './backgroundRunner';

export type {ActivityType};
export type {TrackingLocation, TrackingSnapshot} from './tracker';

let hydrationPromise: Promise<TrackingSnapshot | null> | null = null;

const buildEmptyTrackingSnapshot = (): TrackingSnapshot => {
  const now = Date.now();

  return {
    activityType: 'run',
    isActive: false,
    isPaused: false,
    isFinished: false,
    startedAt: now,
    pausedAt: null,
    finishedAt: null,
    lastUpdatedAt: now,
    elapsedMs: 0,
    distanceMeters: 0,
    speedMps: 0,
    speedKmh: 0,
    ascentMeters: 0,
    altitudeMeters: null,
    lastLocation: null,
    route: [],
  };
};

export const ensureHydratedTracker =
  async (): Promise<TrackingSnapshot | null> => {
    if (!hydrationPromise) {
      hydrationPromise = loadTrackingSnapshot().catch(error => {
        hydrationPromise = null;

        console.warn(
          '[GeoZone][location] No se pudo hidratar el tracker:',
          error,
        );

        return null;
      });
    }

    return hydrationPromise;
  };

export const resetHydratedTracker = (): void => {
  hydrationPromise = null;
};

export const getNativeTrackingSnapshot =
  async (): Promise<TrackingSnapshot> => {
    const currentSnapshot = getTrackingSnapshot();

    if (currentSnapshot) {
      return currentSnapshot;
    }

    const hydratedSnapshot = await ensureHydratedTracker();

    if (hydratedSnapshot) {
      return hydratedSnapshot;
    }

    return buildEmptyTrackingSnapshot();
  };

export const startNativeTracking = async (
  activityType: ActivityType,
): Promise<TrackingSnapshot> => {
  const snapshot = await startTracking(activityType);
  return snapshot;
};

export const pauseNativeTracking =
  async (): Promise<TrackingSnapshot | null> => {
    return pauseTracking();
  };

export const resumeNativeTracking =
  async (): Promise<TrackingSnapshot | null> => {
    return resumeTracking();
  };

export const finishNativeTracking =
  async (): Promise<TrackingSnapshot | null> => {
    return finishTracking();
  };

export const stopNativeTracking = async (): Promise<void> => {
  await stopTracking();
};

export const clearNativeTrackingSession = async (): Promise<void> => {
  await clearTrackingSession();
  resetHydratedTracker();
};

export {
  clearTrackingSession,
  finishTracking,
  getLastTrackingBackgroundSnapshot,
  getTrackingSnapshot,
  isTrackingBackgroundRunnerStarted,
  loadTrackingSnapshot,
  pauseTracking,
  requestTrackingPermissions,
  resumeTracking,
  setTrackingBackgroundStatus,
  startTracking,
  startTrackingBackgroundRunner,
  stopTracking,
  stopTrackingBackgroundRunner,
  subscribeTrackingSnapshot,
  updateTrackingBackgroundRunner,
};