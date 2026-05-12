import {
  clearTrackingSession,
  finishTracking,
  getTrackingSnapshot as getTrackingSnapshotInternal,
  getTrackingStorageKey,
  loadTrackingSnapshot,
  pauseTracking,
  requestTrackingPermissions,
  resumeTracking,
  startTracking,
  stopTracking,
  subscribeTracking,
  subscribeTrackingSnapshot,
  type TrackingLocation,
  type TrackingSnapshot,
} from './tracker';

export type {TrackingLocation, TrackingSnapshot};

export {
  clearTrackingSession,
  finishTracking,
  getTrackingStorageKey,
  pauseTracking,
  requestTrackingPermissions,
  resumeTracking,
  startTracking,
  stopTracking,
  subscribeTracking,
  subscribeTrackingSnapshot,
};

let hydrationPromise: Promise<TrackingSnapshot | null> | null = null;

/**
 * Hidrata el tracker desde AsyncStorage una sola vez.
 *
 * Importante:
 * El tracker real exporta `loadTrackingSnapshot`, por eso NO debemos llamar
 * funciones inexistentes como hydrateTrackerFromStorage.
 */
export const ensureHydratedTracker = async (): Promise<TrackingSnapshot | null> => {
  if (!hydrationPromise) {
    hydrationPromise = loadTrackingSnapshot().catch(error => {
      hydrationPromise = null;
      throw error;
    });
  }

  return hydrationPromise;
};

/**
 * Devuelve el snapshot actual del tracker después de hidratarlo.
 *
 * Puede retornar null cuando no hay actividad activa guardada.
 */
export const getNativeTrackingSnapshot = async (): Promise<TrackingSnapshot | null> => {
  await ensureHydratedTracker();
  return getTrackingSnapshotInternal();
};

/**
 * Snapshot síncrono del tracker.
 * Útil para componentes/hooks que solo necesitan consultar memoria.
 */
export const getTrackingSnapshot = (): TrackingSnapshot | null => {
  return getTrackingSnapshotInternal();
};

/**
 * Alias explícito para mantener compatibilidad si alguna clase antigua
 * usa este nombre.
 */
export const getCurrentTrackingSnapshot = (): TrackingSnapshot | null => {
  return getTrackingSnapshotInternal();
};

/**
 * Permite reiniciar la hidratación si en algún flujo necesitas forzar
 * una nueva lectura desde AsyncStorage.
 */
export const resetTrackerHydration = (): void => {
  hydrationPromise = null;
};