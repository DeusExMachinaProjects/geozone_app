export type ActivityType = 'run' | 'ride' | 'pet';

export type TrackingBackgroundSnapshot = {
  activityType?: ActivityType;
  isActive?: boolean;
  isPaused?: boolean;
  isFinished?: boolean;
  elapsedMs?: number;
  distanceMeters?: number;
  speedMps?: number;
  speedKmh?: number;
  ascentMeters?: number;
  altitudeMeters?: number | null;
  lastUpdatedAt?: number;
};

let backgroundRunnerStarted = false;
let lastActivityType: ActivityType | null = null;
let lastSnapshot: TrackingBackgroundSnapshot | null = null;

/**
 * IMPORTANTE:
 * Esta versión deja el background runner en modo seguro para evitar que Android
 * cierre la app por problemas del foreground service / background-actions.
 *
 * El tracking GPS principal sigue funcionando desde tracker.ts.
 * Después podemos reactivar el foreground service con AndroidManifest correcto.
 */
export const startTrackingBackgroundRunner = async (
  activityType: ActivityType,
  snapshot?: TrackingBackgroundSnapshot | null,
): Promise<void> => {
  try {
    backgroundRunnerStarted = true;
    lastActivityType = activityType;
    lastSnapshot = {
      ...(snapshot ?? {}),
      activityType,
      isActive: snapshot?.isActive ?? true,
      isPaused: snapshot?.isPaused ?? false,
      isFinished: snapshot?.isFinished ?? false,
      lastUpdatedAt: Date.now(),
    };

    if (__DEV__) {
      console.log('[GeoZone][backgroundRunner] iniciado en modo seguro', {
        activityType,
        isActive: lastSnapshot.isActive,
        isPaused: lastSnapshot.isPaused,
        distanceMeters: lastSnapshot.distanceMeters ?? 0,
        elapsedMs: lastSnapshot.elapsedMs ?? 0,
      });
    }
  } catch (error) {
    console.warn(
      '[GeoZone][backgroundRunner] No se pudo iniciar background runner:',
      error,
    );
  }
};

export const updateTrackingBackgroundRunner = async (
  snapshot?: TrackingBackgroundSnapshot | null,
): Promise<void> => {
  try {
    if (!snapshot) {
      return;
    }

    lastSnapshot = {
      ...(lastSnapshot ?? {}),
      ...snapshot,
      activityType: snapshot.activityType ?? lastActivityType ?? undefined,
      lastUpdatedAt: Date.now(),
    };

    if (lastSnapshot.activityType) {
      lastActivityType = lastSnapshot.activityType;
    }

    if (__DEV__) {
      console.log('[GeoZone][backgroundRunner] actualizado', {
        activityType: lastSnapshot.activityType,
        isActive: lastSnapshot.isActive,
        isPaused: lastSnapshot.isPaused,
        distanceMeters: lastSnapshot.distanceMeters ?? 0,
        elapsedMs: lastSnapshot.elapsedMs ?? 0,
      });
    }
  } catch (error) {
    console.warn(
      '[GeoZone][backgroundRunner] No se pudo actualizar background runner:',
      error,
    );
  }
};

export const setTrackingBackgroundStatus = async (
  snapshot?: TrackingBackgroundSnapshot | null,
): Promise<void> => {
  await updateTrackingBackgroundRunner(snapshot);
};

export const stopTrackingBackgroundRunner = async (): Promise<void> => {
  try {
    backgroundRunnerStarted = false;

    if (lastSnapshot) {
      lastSnapshot = {
        ...lastSnapshot,
        isActive: false,
        isPaused: false,
        isFinished: true,
        speedMps: 0,
        speedKmh: 0,
        lastUpdatedAt: Date.now(),
      };
    }

    if (__DEV__) {
      console.log('[GeoZone][backgroundRunner] detenido');
    }
  } catch (error) {
    console.warn(
      '[GeoZone][backgroundRunner] No se pudo detener background runner:',
      error,
    );
  } finally {
    lastActivityType = null;
  }
};

export const isTrackingBackgroundRunnerStarted = (): boolean => {
  return backgroundRunnerStarted;
};

export const getLastTrackingBackgroundSnapshot =
  (): TrackingBackgroundSnapshot | null => {
    return lastSnapshot;
  };