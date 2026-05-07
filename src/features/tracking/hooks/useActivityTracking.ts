import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {ActivityType, RunStatus, TrackingPoint} from '../types';
import {
  getLastTrackingSnapshot,
  startNativeTracking,
  stopNativeTracking,
} from '../../../services/location';
import {
  startTrackingBackgroundRunner,
  stopTrackingBackgroundRunner,
} from '../../../services/location/backgroundRunner';
import {getCurrentWeatherByLocation} from '../../../services/weather/weatherApi';
import type {CurrentWeather} from '../../../services/weather/weatherApi';
import {finishTrackingSession} from '../../../services/tracking/trackingApi';

const TICK_MS = 1000;
const SNAPSHOT_MS = 1500;
const MIN_DISTANCE_METERS_TO_APPEND = 2;
const MIN_ACCURACY_METERS = 80;
const MAX_REASONABLE_SPEED_MPS = 18;
const WEATHER_REFRESH_MS = 10 * 60 * 1000;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function distanceBetweenMeters(a: TrackingPoint, b: TrackingPoint) {
  const earthRadiusMeters = 6371000;
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  return 2 * earthRadiusMeters * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function formatElapsed(milliseconds: number) {
  const safeMs = Math.max(0, milliseconds);
  const totalSeconds = Math.floor(safeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map(value => String(value).padStart(2, '0'))
    .join(':');
}

function isAccurateEnough(point: TrackingPoint) {
  if (point.accuracy === null || point.accuracy === undefined) {
    return true;
  }

  return point.accuracy <= MIN_ACCURACY_METERS;
}

function shouldAppendPoint(route: TrackingPoint[], point: TrackingPoint) {
  if (!isAccurateEnough(point)) {
    return false;
  }

  if (route.length === 0) {
    return true;
  }

  const previous = route[route.length - 1];
  const distance = distanceBetweenMeters(previous, point);
  const elapsedSeconds = Math.max(1, (point.timestamp - previous.timestamp) / 1000);
  const speedMps = distance / elapsedSeconds;

  if (speedMps > MAX_REASONABLE_SPEED_MPS) {
    return false;
  }

  return distance >= MIN_DISTANCE_METERS_TO_APPEND;
}

function normalizeNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export type UseActivityTrackingResult = {
  status: RunStatus;
  route: TrackingPoint[];
  currentLocation: TrackingPoint | null;
  elapsedMs: number;
  elapsedLabel: string;
  distanceMeters: number;
  distanceKm: string;
  speedKmh: string;
  speedMinKmh: number;
  speedPromKmh: number;
  speedMaxKmh: number;
  ascentMeters: number;
  ascentLabel: string;
  weather: CurrentWeather | null;
  weatherLoading: boolean;
  weatherError: string | null;
  errorMessage: string | null;
  showSummary: boolean;
  summary: {
    time: string;
    distance: string;
    speed: string;
    ascent: string;
    weather: string;
  };
  finishLoading: boolean;
  finishError: string | null;
  handlePauseResume: () => void;
  handleFinish: () => Promise<void>;
  closeSummary: () => void;
};

type UseActivityTrackingParams = {
  activityType: ActivityType;
};

export function useActivityTracking({
  activityType,
}: UseActivityTrackingParams): UseActivityTrackingResult {
  const [status, setStatus] = useState<RunStatus>('preparing');
  const [route, setRoute] = useState<TrackingPoint[]>([]);
  const [currentLocation, setCurrentLocation] = useState<TrackingPoint | null>(
    null,
  );
  const [elapsedMs, setElapsedMs] = useState(0);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [speedMinKmh, setSpeedMinKmh] = useState(0);
  const [speedMaxKmh, setSpeedMaxKmh] = useState(0);
  const [speedSumKmh, setSpeedSumKmh] = useState(0);
  const [speedSamples, setSpeedSamples] = useState(0);
  const [ascentMeters, setAscentMeters] = useState(0);
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [finishLoading, setFinishLoading] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);

  const startedAtRef = useRef(Date.now());
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const snapshotIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pausedStartedAtRef = useRef<number | null>(null);
  const pausedTotalMsRef = useRef(0);
  const lastAltitudeRef = useRef<number | null>(null);
  const lastWeatherFetchRef = useRef(0);
  const finishedRef = useRef(false);

  const speedPromKmh = speedSamples > 0 ? speedSumKmh / speedSamples : 0;

  const refreshWeather = useCallback(async (point: TrackingPoint) => {
    const now = Date.now();

    if (now - lastWeatherFetchRef.current < WEATHER_REFRESH_MS) {
      return;
    }

    lastWeatherFetchRef.current = now;
    setWeatherLoading(true);
    setWeatherError(null);

    try {
      const data = await getCurrentWeatherByLocation(point);
      if (data) {
        setWeather(data);
      } else {
        setWeatherError('Clima no disponible');
      }
    } catch {
      setWeatherError('No se pudo obtener el clima');
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  const appendPoint = useCallback(
    (point: TrackingPoint) => {
      setCurrentLocation(point);
      void refreshWeather(point);

      setRoute(previousRoute => {
        if (!shouldAppendPoint(previousRoute, point)) {
          return previousRoute;
        }

        if (previousRoute.length > 0) {
          const previous = previousRoute[previousRoute.length - 1];
          const deltaMeters = distanceBetweenMeters(previous, point);
          setDistanceMeters(value => value + deltaMeters);
        }

        const altitude =
          point.altitude === null || point.altitude === undefined
            ? null
            : Number(point.altitude);

        if (altitude !== null && Number.isFinite(altitude)) {
          if (lastAltitudeRef.current !== null) {
            const deltaAltitude = altitude - lastAltitudeRef.current;
            if (deltaAltitude > 0) {
              setAscentMeters(value => value + deltaAltitude);
            }
          }
          lastAltitudeRef.current = altitude;
        }

        const speedKmh = normalizeNumber(point.speed, 0) * 3.6;
        if (speedKmh > 0) {
          setSpeedMaxKmh(value => Math.max(value, speedKmh));
          setSpeedMinKmh(value => (value === 0 ? speedKmh : Math.min(value, speedKmh)));
          setSpeedSumKmh(value => value + speedKmh);
          setSpeedSamples(value => value + 1);
        }

        return [...previousRoute, point];
      });
    },
    [refreshWeather],
  );

  useEffect(() => {
    let mounted = true;

    async function start() {
      try {
        await startNativeTracking(activityType);
        await startTrackingBackgroundRunner(activityType);

        if (mounted) {
          setStatus('running');
        }
      } catch (error) {
        if (mounted) {
          setStatus('preparing');
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'No se pudo iniciar el seguimiento GPS.',
          );
        }
      }
    }

    void start();

    return () => {
      mounted = false;
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
      }
      if (snapshotIntervalRef.current) {
        clearInterval(snapshotIntervalRef.current);
      }
      void stopNativeTracking();
      void stopTrackingBackgroundRunner();
    };
  }, [activityType]);

  useEffect(() => {
    if (status !== 'running') {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
      return;
    }

    tickIntervalRef.current = setInterval(() => {
      const now = Date.now();
      setElapsedMs(now - startedAtRef.current - pausedTotalMsRef.current);
    }, TICK_MS);

    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
    };
  }, [status]);

  useEffect(() => {
    if (status !== 'running') {
      if (snapshotIntervalRef.current) {
        clearInterval(snapshotIntervalRef.current);
        snapshotIntervalRef.current = null;
      }
      return;
    }

    snapshotIntervalRef.current = setInterval(async () => {
      const snapshot = await getLastTrackingSnapshot();
      if (snapshot) {
        appendPoint(snapshot);
      }
    }, SNAPSHOT_MS);

    return () => {
      if (snapshotIntervalRef.current) {
        clearInterval(snapshotIntervalRef.current);
        snapshotIntervalRef.current = null;
      }
    };
  }, [appendPoint, status]);

  const handlePauseResume = useCallback(() => {
    if (status === 'running') {
      pausedStartedAtRef.current = Date.now();
      setStatus('paused');
      return;
    }

    if (status === 'paused') {
      if (pausedStartedAtRef.current) {
        pausedTotalMsRef.current += Date.now() - pausedStartedAtRef.current;
        pausedStartedAtRef.current = null;
      }
      setStatus('running');
    }
  }, [status]);

  const handleFinish = useCallback(async () => {
    if (finishedRef.current || finishLoading) {
      return;
    }

    finishedRef.current = true;
    setFinishLoading(true);
    setFinishError(null);

    const finishedAt = Date.now();
    const finalElapsedMs = Math.max(
      elapsedMs,
      finishedAt - startedAtRef.current - pausedTotalMsRef.current,
    );

    try {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
      if (snapshotIntervalRef.current) {
        clearInterval(snapshotIntervalRef.current);
        snapshotIntervalRef.current = null;
      }

      await stopNativeTracking();
      await stopTrackingBackgroundRunner();

      await finishTrackingSession({
        activityType,
        startedAt: new Date(startedAtRef.current).toISOString(),
        finishedAt: new Date(finishedAt).toISOString(),
        distanceMeters,
        durationMs: finalElapsedMs,
        ascentMeters,
        velocidadMinKmh: speedMinKmh,
        velocidadPromKmh: speedPromKmh,
        velocidadMaxKmh: speedMaxKmh,
        temperatureC: weather?.temperatureC ?? null,
        apparentTemperatureC: weather?.apparentTemperatureC ?? null,
        humidityPercent: weather?.humidityPercent ?? null,
        windSpeedKmh: weather?.windSpeedKmh ?? null,
        precipitationMm: weather?.precipitationMm ?? null,
        weatherCode: weather?.weatherCode ?? null,
        weatherCondition: weather?.condition ?? null,
        weatherConditionLabel: weather?.conditionLabel ?? null,
        route: route.map((point, index) => ({
          secuencia: index + 1,
          latitude: point.latitude,
          longitude: point.longitude,
          timestamp: point.timestamp ?? null,
          speedMps: point.speed ?? null,
          altitudeMeters: point.altitude ?? null,
          heading: point.heading ?? null,
        })),
      });

      setElapsedMs(finalElapsedMs);
      setStatus('finished');
      setShowSummary(true);
    } catch (error) {
      finishedRef.current = false;
      setFinishError(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar y finalizar la actividad.',
      );
    } finally {
      setFinishLoading(false);
    }
  }, [
    activityType,
    ascentMeters,
    distanceMeters,
    elapsedMs,
    finishLoading,
    route,
    speedMaxKmh,
    speedMinKmh,
    speedPromKmh,
    weather,
  ]);

  const elapsedLabel = useMemo(() => formatElapsed(elapsedMs), [elapsedMs]);
  const distanceKm = useMemo(
    () => (distanceMeters / 1000).toFixed(2),
    [distanceMeters],
  );
  const speedKmh = useMemo(() => {
    if (status !== 'running') {
      return '0.0';
    }
    const lastSpeed = currentLocation?.speed;
    const speed = normalizeNumber(lastSpeed, 0) * 3.6;
    return speed.toFixed(1);
  }, [currentLocation?.speed, status]);
  const ascentLabel = useMemo(
    () => Math.round(ascentMeters).toString(),
    [ascentMeters],
  );

  return {
    status,
    route,
    currentLocation,
    elapsedMs,
    elapsedLabel,
    distanceMeters,
    distanceKm,
    speedKmh,
    speedMinKmh,
    speedPromKmh,
    speedMaxKmh,
    ascentMeters,
    ascentLabel,
    weather,
    weatherLoading,
    weatherError,
    errorMessage,
    showSummary,
    summary: {
      time: elapsedLabel,
      distance: `${distanceKm} km`,
      speed: `${speedPromKmh.toFixed(1)} km/h`,
      ascent: `${ascentLabel} m`,
      weather: weather
        ? `${weather.temperatureC.toFixed(0)} °C · ${weather.conditionLabel}`
        : 'Sin clima',
    },
    finishLoading,
    finishError,
    handlePauseResume,
    handleFinish,
    closeSummary: () => setShowSummary(false),
  };
}
