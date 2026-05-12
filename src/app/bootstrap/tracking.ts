import {
  ensureHydratedTracker,
  getNativeTrackingSnapshot,
} from '../../services/location';

let bootstrapPromise: Promise<void> | null = null;

const bootstrapTrackingInternal = async (): Promise<void> => {
  await ensureHydratedTracker();

  const snapshot = await getNativeTrackingSnapshot();

  if (__DEV__) {
    if (!snapshot) {
      console.log('[tracking] bootstrap snapshot', {
        hasSnapshot: false,
        message: 'No hay sesión de tracking activa o guardada.',
      });

      return;
    }

    console.log('[tracking] bootstrap snapshot', {
      hasSnapshot: true,
      isActive: snapshot.isActive,
      isPaused: snapshot.isPaused,
      isFinished: snapshot.isFinished,
      activityType: snapshot.activityType,
      distanceMeters: snapshot.distanceMeters,
      elapsedMs: snapshot.elapsedMs,
    });
  }
};

export const bootstrapTracking = async (): Promise<void> => {
  if (!bootstrapPromise) {
    bootstrapPromise = bootstrapTrackingInternal().catch(error => {
      bootstrapPromise = null;

      if (__DEV__) {
        console.warn('[tracking] No se pudo inicializar tracking', error);
      }

      throw error;
    });
  }

  return bootstrapPromise;
};

export const resetTrackingBootstrap = (): void => {
  bootstrapPromise = null;
};