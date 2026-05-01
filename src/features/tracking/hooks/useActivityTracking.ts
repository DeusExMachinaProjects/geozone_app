import {Alert, AppState} from 'react-native';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {CurrentWeather} from '../../../services/weather/weatherApi';
import {getCurrentWeatherByLocation} from '../../../services/weather/weatherApi';

import {
  getNativeTrackingSnapshot,
  openNativeLocationSettings,
  pauseNativeTracking,
  resumeNativeTracking,
  startNativeTracking,
  stopNativeTracking,
  type ActivityTrackingSnapshot,
} from '../../../services/location';

import type {ActivityType, TrackingPoint} from '../../tracking/types';

import {
  formatAscentMeters,
  formatDistanceKm,
  formatElapsedTime,
  formatSpeedKmh,
} from '../utils/trackingCalculations';

type UseActivityTrackingOptions = {
  activityType: ActivityType;
  onClose?: () => void;
};

type TrackingUiStatus = 'idle' | 'preparing' | 'running' | 'paused' | 'finished';

type TrackingSummaryData = {
  time: string;
  distance: string;
  speed: string;
  ascent: string;
};

export type UseActivityTrackingResult = {
  activityType: ActivityType;
  route: TrackingPoint[];
  currentLocation: TrackingPoint | null;
  currentPoint: TrackingPoint | null;
  status: TrackingUiStatus;
  nativeStatus: ActivityTrackingSnapshot['status'];
  errorMessage: string | null;
  distanceMeters: number;
  durationMs: number;
  ascentMeters: number;
  currentAltitudeMeters: number | null;
  currentSpeedMps: number;
  distanceKm: string;
  speedKmh: string;
  elapsedLabel: string;
  ascentLabel: string;
  summaryVisible: boolean;
  summaryTitle: string;
  summaryData: TrackingSummaryData | null;
  exitModalVisible: boolean;
  openExitModal: () => void;
  closeExitModal: () => void;
  confirmExit: () => Promise<void>;
  closeSummary: () => void;
  openLocationSettings: () => void;
  handlePauseResume: () => Promise<void>;
  handleFinish: () => Promise<void>;
  refresh: () => Promise<void>;
  weather: CurrentWeather | null;
  weatherLoading: boolean;
  weatherError: string | null;
};

const EMPTY_SNAPSHOT: ActivityTrackingSnapshot = {
  activityType: null,
  status: 'idle',
  startedAt: null,
  distanceMeters: 0,
  durationMs: 0,
  currentSpeedMps: 0,
  ascentMeters: 0,
  currentAltitudeMeters: null,
  route: [],
  lastLocation: null,
  errorCode: null,
};

function normalizeSnapshot(
  snapshot?: Partial<ActivityTrackingSnapshot> | null,
): ActivityTrackingSnapshot {
  return {
    activityType: snapshot?.activityType ?? null,
    status: snapshot?.status ?? 'idle',
    startedAt: snapshot?.startedAt ?? null,
    distanceMeters: Number(snapshot?.distanceMeters ?? 0),
    durationMs: Number(snapshot?.durationMs ?? 0),
    currentSpeedMps: Number(snapshot?.currentSpeedMps ?? 0),
    ascentMeters: Number(snapshot?.ascentMeters ?? 0),
    currentAltitudeMeters: snapshot?.currentAltitudeMeters ?? null,
    route: Array.isArray(snapshot?.route) ? snapshot.route : [],
    lastLocation: snapshot?.lastLocation ?? null,
    errorCode: snapshot?.errorCode ?? null,
  };
}

function mapUiStatus(
  nativeStatus: ActivityTrackingSnapshot['status'],
  isPreparing: boolean,
  summaryVisible: boolean,
): TrackingUiStatus {
  if (summaryVisible) {
    return 'finished';
  }

  if (isPreparing) {
    return 'preparing';
  }

  if (nativeStatus === 'paused') {
    return 'paused';
  }

  if (nativeStatus === 'tracking') {
    return 'running';
  }

  if (nativeStatus === 'finished') {
    return 'finished';
  }

  return 'idle';
}

function getSummaryTitle(activityType: ActivityType): string {
  switch (activityType) {
    case 'run':
      return 'Resumen de carrera';
    case 'ride':
      return 'Resumen de pedaleo';
    case 'pet':
      return 'Resumen de paseo';
    default:
      return 'Resumen de actividad';
  }
}

function buildSummaryData(
  snapshot: ActivityTrackingSnapshot,
): TrackingSummaryData {
  const totalSeconds = snapshot.durationMs / 1000;
  const avgSpeedMps =
    totalSeconds > 0 ? snapshot.distanceMeters / totalSeconds : 0;

  return {
    time: formatElapsedTime(snapshot.durationMs),
    distance: formatDistanceKm(snapshot.distanceMeters),
    speed: formatSpeedKmh(avgSpeedMps),
    ascent: formatAscentMeters(snapshot.ascentMeters),
  };
}

export function useActivityTracking({
  activityType,
  onClose,
}: UseActivityTrackingOptions): UseActivityTrackingResult {
  const [snapshot, setSnapshot] =
    useState<ActivityTrackingSnapshot>(EMPTY_SNAPSHOT);
  const [isPreparing, setIsPreparing] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [summaryData, setSummaryData] = useState<TrackingSummaryData | null>(
    null,
  );
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const lastWeatherFetchRef = useRef(0);

  const appStateRef = useRef(AppState.currentState);

  const hydrateSnapshot = useCallback(
    (nextSnapshot?: Partial<ActivityTrackingSnapshot> | null) => {
      setSnapshot(normalizeSnapshot(nextSnapshot));
    },
    [],
  );

  const refresh = useCallback(async () => {
    try {
      const current = await getNativeTrackingSnapshot();
      hydrateSnapshot(current);
    } catch (error) {
      if (__DEV__) {
        console.warn('No se pudo refrescar el snapshot de tracking', error);
      }
    }
  }, [hydrateSnapshot]);

  const initializeTracking = useCallback(async () => {
    setIsPreparing(true);
    setErrorMessage(null);

    try {
      const currentSnapshot = normalizeSnapshot(await getNativeTrackingSnapshot());

      const alreadyActive =
        currentSnapshot.status === 'tracking' ||
        currentSnapshot.status === 'paused';

      if (alreadyActive) {
        hydrateSnapshot(currentSnapshot);
        return;
      }

      const startedSnapshot = await startNativeTracking(activityType);

      if (!startedSnapshot) {
        const message =
          'No se pudieron obtener los permisos necesarios de ubicación.';
        setErrorMessage(message);
        return;
      }

      hydrateSnapshot(startedSnapshot);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo iniciar el seguimiento.';

      setErrorMessage(message);
      Alert.alert('Seguimiento', message);
    } finally {
      setIsPreparing(false);
    }
  }, [activityType, hydrateSnapshot]);

  useEffect(() => {
    void initializeTracking();
  }, [initializeTracking]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      const wasInBackground =
        appStateRef.current === 'background' ||
        appStateRef.current === 'inactive';

      const isNowActive = nextState === 'active';

      if (wasInBackground && isNowActive) {
        void refresh();
      }

      appStateRef.current = nextState;
    });

    return () => {
      subscription.remove();
    };
  }, [refresh]);

  useEffect(() => {
    if (summaryVisible) {
      return;
    }

    const interval = setInterval(() => {
      void refresh();
    }, 1000);

    return () => clearInterval(interval);
  }, [refresh, summaryVisible]);

useEffect(() => {
  const lastLocation = snapshot.lastLocation;

  if (!lastLocation) {
    return;
  }

  const now = Date.now();
  const fiveMinutesMs = 5 * 60 * 1000;

  if (now - lastWeatherFetchRef.current < fiveMinutesMs && weather) {
    return;
  }

  let isMounted = true;

  async function loadWeather() {
    try {
      setWeatherLoading(true);
      setWeatherError(null);

      const nextWeather = await getCurrentWeatherByLocation(lastLocation);

      if (!isMounted) {
        return;
      }

      if (nextWeather) {
        setWeather(nextWeather);
        lastWeatherFetchRef.current = Date.now();
      }
    } catch (error) {
      if (!isMounted) {
        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo obtener el clima actual.';

      setWeatherError(message);
    } finally {
      if (isMounted) {
        setWeatherLoading(false);
      }
    }
  }

  void loadWeather();

  return () => {
    isMounted = false;
  };
}, [snapshot.lastLocation, weather]);

  const handlePauseResume = useCallback(async () => {
    if (isPreparing || summaryVisible) {
      return;
    }

    try {
      const updatedSnapshot =
        snapshot.status === 'paused'
          ? await resumeNativeTracking()
          : await pauseNativeTracking();

      hydrateSnapshot(updatedSnapshot);
      setErrorMessage(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cambiar el estado de la actividad.';

      setErrorMessage(message);
      Alert.alert('Actividad', message);
    }
  }, [hydrateSnapshot, isPreparing, snapshot.status, summaryVisible]);

  const handleFinish = useCallback(async () => {
    if (isPreparing || summaryVisible) {
      return;
    }

    try {
      const finalSnapshot = normalizeSnapshot(await stopNativeTracking());

      hydrateSnapshot(finalSnapshot);
      setSummaryData(buildSummaryData(finalSnapshot));
      setSummaryVisible(true);
      setExitModalVisible(false);
      setErrorMessage(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo finalizar la actividad.';

      setErrorMessage(message);
      Alert.alert('Actividad', message);
    }
  }, [hydrateSnapshot, isPreparing, summaryVisible]);

  const openExitModal = useCallback(() => {
    setExitModalVisible(true);
  }, []);

  const closeExitModal = useCallback(() => {
    setExitModalVisible(false);
  }, []);

  const confirmExit = useCallback(async () => {
    try {
      setExitModalVisible(false);
      await stopNativeTracking();
      onClose?.();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo salir de la actividad.';

      setErrorMessage(message);
      Alert.alert('Actividad', message);
    }
  }, [onClose]);

  const closeSummary = useCallback(() => {
    setSummaryVisible(false);
  }, []);

  const openLocationSettings = useCallback(() => {
    openNativeLocationSettings();
  }, []);

  const status = useMemo(
    () => mapUiStatus(snapshot.status, isPreparing, summaryVisible),
    [snapshot.status, isPreparing, summaryVisible],
  );

  const distanceKm = useMemo(
    () => formatDistanceKm(snapshot.distanceMeters),
    [snapshot.distanceMeters],
  );

  const speedKmh = useMemo(
    () => formatSpeedKmh(snapshot.currentSpeedMps),
    [snapshot.currentSpeedMps],
  );

  const elapsedLabel = useMemo(
    () => formatElapsedTime(snapshot.durationMs),
    [snapshot.durationMs],
  );

  const ascentLabel = useMemo(
    () => formatAscentMeters(snapshot.ascentMeters),
    [snapshot.ascentMeters],
  );

  return {
    activityType,
    route: snapshot.route,
    currentLocation: snapshot.lastLocation,
    currentPoint: snapshot.lastLocation,
    status,
    nativeStatus: snapshot.status,
    errorMessage,
    distanceMeters: snapshot.distanceMeters,
    durationMs: snapshot.durationMs,
    ascentMeters: snapshot.ascentMeters,
    currentAltitudeMeters: snapshot.currentAltitudeMeters,
    currentSpeedMps: snapshot.currentSpeedMps,
    distanceKm,
    speedKmh,
    elapsedLabel,
    ascentLabel,
    summaryVisible,
    summaryTitle: getSummaryTitle(activityType),
    summaryData,
    exitModalVisible,
    openExitModal,
    closeExitModal,
    confirmExit,
    closeSummary,
    openLocationSettings,
    handlePauseResume,
    handleFinish,
    refresh,
  };
}