import {
  ensureHydratedTracker,
  getNativeTrackingSnapshot,
} from '../../services/location';

let bootstrapPromise: Promise<void> | null = null;

const bootstrapTrackingInternal = async (): Promise<void> => {
  try {
    await ensureHydratedTracker();

    const snapshot = await getNativeTrackingSnapshot();

    if (__DEV__) {
      console.log('[tracking] bootstrap snapshot', {
        isActive: snapshot.isActive,
        isPaused: snapshot.isPaused,
        isFinished: snapshot.isFinished,
        activityType: snapshot.activityType,
        distanceMeters: snapshot.distanceMeters,
        elapsedMs: snapshot.elapsedMs,
      });
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('[tracking] No se pudo inicializar tracking', error);
    }
  }
};

export const bootstrapTracking = async (): Promise<void> => {
  if (!bootstrapPromise) {
    bootstrapPromise = bootstrapTrackingInternal();
  }

  return bootstrapPromise;
};

export const resetTrackingBootstrap = (): void => {
  bootstrapPromise = null;
};