import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {AppState, Linking, PermissionsAndroid, Platform} from 'react-native';
import type {
  ActivityType,
  RunStatus,
  TrackingPoint,
  TrackingSummary,
} from '../types';
import {
  deriveErrorMessage,
  formatDistanceKm,
  formatElapsedFromMs,
  formatSpeedKmh,
  isSamePoint,
} from '../utils/trackingCalculations';
import {
  getNativeTrackingSnapshot,
  openNativeLocationSettings,
  pauseNativeTracking,
  resumeNativeTracking,
  startNativeTracking,
  stopNativeTracking,
  type NativeTrackingSnapshot,
} from '../../../services/location';

type UseActivityTrackingParams = {
  activityType: ActivityType;
};

function getActivityConfig(activityType: ActivityType) {
  if (activityType === 'ride') {
    return {
      summaryTitle: 'Pedaleo finalizado',
    };
  }

  return {
    summaryTitle: 'Carrera finalizada',
  };
}

function getReadableError(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim()) {
    return error;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as {message?: unknown}).message === 'string'
  ) {
    return (error as {message: string}).message;
  }

  return fallback;
}

export function useActivityTracking({
  activityType,
}: UseActivityTrackingParams) {
  const config = useMemo(() => getActivityConfig(activityType), [activityType]);

  const [status, setStatus] = useState<RunStatus>('preparing');
  const [elapsedMs, setElapsedMs] = useState(0);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [route, setRoute] = useState<TrackingPoint[]>([]);
  const [currentLocation, setCurrentLocation] = useState<TrackingPoint | null>(
    null,
  );
  const [currentSpeedMps, setCurrentSpeedMps] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [summaryData, setSummaryData] = useState<TrackingSummary | null>(null);

  const appStateRef = useRef(AppState.currentState);
  const gpsPromptedRef = useRef(false);
  const isMountedRef = useRef(true);
  const initialStartAttemptedRef = useRef(false);
  const permissionFlowRef = useRef<Promise<boolean> | null>(null);
  const notificationAskedRef = useRef(false);

  const distanceKm = useMemo(
    () => formatDistanceKm(distanceMeters),
    [distanceMeters],
  );

  const speedKmh = useMemo(
    () => formatSpeedKmh(currentSpeedMps),
    [currentSpeedMps],
  );

  const averageSpeedKmh = useMemo(() => {
    if (elapsedMs <= 0) {
      return '0.0';
    }

    const avgMps = distanceMeters / (elapsedMs / 1000);
    return formatSpeedKmh(avgMps);
  }, [distanceMeters, elapsedMs]);

  const requestNotificationPermission = useCallback(async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    if (Platform.Version < 33) {
      notificationAskedRef.current = true;
      return true;
    }

    if (notificationAskedRef.current) {
      return true;
    }

    const alreadyGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    if (alreadyGranted) {
      notificationAskedRef.current = true;
      return true;
    }

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: 'Notificaciones de actividad',
        message:
          'GeoZone necesita mostrar una notificación mientras el seguimiento está activo.',
        buttonPositive: 'Aceptar',
        buttonNegative: 'Cancelar',
      },
    );

    notificationAskedRef.current = true;
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }, []);

  const ensureTrackingPermissions = useCallback(async () => {
    if (Platform.OS !== 'android') {
      return false;
    }

    if (permissionFlowRef.current) {
      return permissionFlowRef.current;
    }

    permissionFlowRef.current = (async () => {
      const finePermission =
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
      const coarsePermission =
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION;

      const hasFine = await PermissionsAndroid.check(finePermission);
      const hasCoarse = await PermissionsAndroid.check(coarsePermission);

      if (hasFine || hasCoarse) {
        await requestNotificationPermission();
        return true;
      }

      const result = await PermissionsAndroid.request(finePermission, {
        title: 'Permiso de ubicación',
        message:
          'GeoZone necesita tu ubicación para registrar tiempo, distancia, velocidad y dibujar la ruta en el mapa.',
        buttonPositive: 'Aceptar',
        buttonNegative: 'Cancelar',
      });

      if (result !== PermissionsAndroid.RESULTS.GRANTED) {
        if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Linking.openSettings().catch(() => {});
        }
        return false;
      }

      await requestNotificationPermission();
      return true;
    })().finally(() => {
      permissionFlowRef.current = null;
    });

    return permissionFlowRef.current;
  }, [requestNotificationPermission]);

  const applySnapshot = useCallback(async (snapshot: NativeTrackingSnapshot | null) => {
    if (!snapshot || !isMountedRef.current) {
      return;
    }

    setElapsedMs(snapshot.elapsedMs);
    setDistanceMeters(snapshot.distanceMeters);
    setCurrentSpeedMps(snapshot.speedMps);

    const nextLocation = snapshot.hasLocation ? snapshot.location : null;

    setCurrentLocation(prev =>
      isSamePoint(prev, nextLocation) ? prev : nextLocation,
    );

    setRoute(snapshot.route ?? []);
    setErrorMessage(deriveErrorMessage(snapshot.errorCode));

    setStatus(prev => {
      if (prev === 'finished') {
        return prev;
      }

      if (!snapshot.isActive) {
        return 'paused';
      }

      if (snapshot.isPaused) {
        return 'paused';
      }

      if (snapshot.hasLocation) {
        return 'running';
      }

      if (snapshot.errorCode) {
        return 'paused';
      }

      return 'preparing';
    });

    if (snapshot.errorCode === 'gps_disabled') {
      if (!gpsPromptedRef.current) {
        gpsPromptedRef.current = true;
        try {
          await openNativeLocationSettings();
        } catch {}
      }
    } else {
      gpsPromptedRef.current = false;
    }
  }, []);

  const syncSnapshot = useCallback(async () => {
    if (Platform.OS !== 'android') {
      setErrorMessage(
        'La versión actual del seguimiento en segundo plano quedó preparada primero para Android.',
      );
      return null;
    }

    try {
      const snapshot = await getNativeTrackingSnapshot();
      await applySnapshot(snapshot);
      return snapshot;
    } catch (error) {
      if (isMountedRef.current) {
        setErrorMessage(
          getReadableError(error, 'No se pudo sincronizar el seguimiento.'),
        );
      }
      return null;
    }
  }, [applySnapshot]);

  const initializeTracking = useCallback(async () => {
    if (Platform.OS !== 'android') {
      setStatus('paused');
      setErrorMessage(
        'La versión actual del seguimiento en segundo plano quedó preparada primero para Android.',
      );
      return;
    }

    setStatus('preparing');

    const granted = await ensureTrackingPermissions();

    if (!granted) {
      setStatus('paused');
      setErrorMessage(
        'Permiso de ubicación requerido para iniciar el seguimiento.',
      );
      return;
    }

    try {
      await startNativeTracking(activityType);
      await syncSnapshot();
    } catch (error) {
      setStatus('paused');
      setErrorMessage(
        getReadableError(error, 'No se pudo iniciar el seguimiento nativo.'),
      );
    }
  }, [activityType, ensureTrackingPermissions, syncSnapshot]);

  useEffect(() => {
    isMountedRef.current = true;

    if (!initialStartAttemptedRef.current) {
      initialStartAttemptedRef.current = true;
      initializeTracking();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [initializeTracking]);

  useEffect(() => {
    if (Platform.OS !== 'android' || status === 'finished') {
      return;
    }

    const intervalId = setInterval(() => {
      if (!permissionFlowRef.current) {
        syncSnapshot();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [status, syncSnapshot]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      const previousState = appStateRef.current;
      appStateRef.current = nextState;

      const cameToForeground =
        previousState.match(/inactive|background/) && nextState === 'active';

      if (cameToForeground && !permissionFlowRef.current) {
        syncSnapshot();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [syncSnapshot]);

  const handlePauseResume = useCallback(async () => {
    try {
      if (status === 'running') {
        await pauseNativeTracking();
        await syncSnapshot();
        return;
      }

      const granted = await ensureTrackingPermissions();

      if (!granted) {
        setStatus('paused');
        setErrorMessage(
          'Permiso de ubicación requerido para continuar.',
        );
        return;
      }

      await resumeNativeTracking();
      await syncSnapshot();
    } catch (error) {
      setErrorMessage(
        getReadableError(error, 'No se pudo cambiar el estado del seguimiento.'),
      );
    }
  }, [ensureTrackingPermissions, status, syncSnapshot]);

  const handleFinish = useCallback(async () => {
    let finalSnapshot: NativeTrackingSnapshot | null = null;

    try {
      finalSnapshot = await syncSnapshot();
    } catch {}

    const finalElapsedMs = finalSnapshot?.elapsedMs ?? elapsedMs;
    const finalDistanceMeters = finalSnapshot?.distanceMeters ?? distanceMeters;
    const finalAverageSpeed =
      finalElapsedMs > 0
        ? formatSpeedKmh(finalDistanceMeters / (finalElapsedMs / 1000))
        : '0.0';

    try {
      await stopNativeTracking();
    } catch {}

    setStatus('finished');
    setCurrentSpeedMps(0);

    setSummaryData({
      time: formatElapsedFromMs(finalElapsedMs),
      distance: `${formatDistanceKm(finalDistanceMeters)} km`,
      speed: `${finalAverageSpeed} km/h`,
    });

    setSummaryVisible(true);
  }, [distanceMeters, elapsedMs, syncSnapshot]);

  const closeSummary = useCallback(() => {
    setSummaryVisible(false);
  }, []);

  return {
    activityType,
    status,
    elapsedSeconds: Math.floor(elapsedMs / 1000),
    elapsedLabel: formatElapsedFromMs(elapsedMs),
    distanceKm,
    speedKmh,
    averageSpeedKmh,
    route,
    currentLocation,
    errorMessage,
    summaryVisible,
    summaryTitle: config.summaryTitle,
    summaryData,
    handlePauseResume,
    handleFinish,
    closeSummary,
  };
}

export type UseActivityTrackingResult = ReturnType<typeof useActivityTracking>;