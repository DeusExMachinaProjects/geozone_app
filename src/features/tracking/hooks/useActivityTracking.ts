import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Linking, PermissionsAndroid, Platform} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import type {
  ActivityType,
  RunStatus,
  TrackingPoint,
  TrackingSummary,
} from '../types';

type UseActivityTrackingParams = {
  activityType: ActivityType;
};

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function calculateDistanceInMeters(start: TrackingPoint, end: TrackingPoint) {
  const R = 6371000;
  const dLat = toRad(end.latitude - start.latitude);
  const dLon = toRad(end.longitude - start.longitude);
  const lat1 = toRad(start.latitude);
  const lat2 = toRad(end.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatElapsed(seconds: number) {
  const hrs = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0');
  const mins = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');

  return `${hrs}:${mins}:${secs}`;
}

function formatDistanceKm(meters: number) {
  return (meters / 1000).toFixed(2);
}

function formatSpeedKmh(speedMps: number) {
  return (speedMps * 3.6).toFixed(1);
}

function getActivityConfig(activityType: ActivityType) {
  if (activityType === 'ride') {
    return {
      minDistanceDeltaMeters: 1.5,
      summaryTitle: 'Pedaleo finalizado',
    };
  }

  return {
    minDistanceDeltaMeters: 0.5,
    summaryTitle: 'Carrera finalizada',
  };
}

export function useActivityTracking({
  activityType,
}: UseActivityTrackingParams) {
  const config = useMemo(() => getActivityConfig(activityType), [activityType]);

  const watchIdRef = useRef<number | null>(null);
  const totalDistanceRef = useRef(0);
  const lastTimestampRef = useRef<number | null>(null);

  const [status, setStatus] = useState<RunStatus>('preparing');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [route, setRoute] = useState<TrackingPoint[]>([]);
  const [currentLocation, setCurrentLocation] = useState<TrackingPoint | null>(
    null,
  );
  const [currentSpeedMps, setCurrentSpeedMps] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [summaryData, setSummaryData] = useState<TrackingSummary | null>(null);

  const distanceKm = useMemo(
    () => formatDistanceKm(totalDistanceRef.current),
    [route],
  );

  const speedKmh = useMemo(
    () => formatSpeedKmh(currentSpeedMps),
    [currentSpeedMps],
  );

  const averageSpeedKmh = useMemo(() => {
    if (elapsedSeconds <= 0) {
      return '0.0';
    }

    const avgMps = totalDistanceRef.current / elapsedSeconds;
    return formatSpeedKmh(avgMps);
  }, [elapsedSeconds, route]);

  const clearLocationWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const appendPoint = useCallback(
    (point: TrackingPoint) => {
      setCurrentLocation(point);

      setRoute(prev => {
        if (prev.length === 0) {
          totalDistanceRef.current = 0;
          lastTimestampRef.current = point.timestamp;
          setCurrentSpeedMps(
            typeof point.speed === 'number' && point.speed > 0 ? point.speed : 0,
          );
          return [point];
        }

        const lastPoint = prev[prev.length - 1];
        const segmentDistance = calculateDistanceInMeters(lastPoint, point);

        let nextSpeed = 0;

        if (typeof point.speed === 'number' && point.speed > 0) {
          nextSpeed = point.speed;
        } else if (lastTimestampRef.current) {
          const deltaSeconds = (point.timestamp - lastTimestampRef.current) / 1000;
          if (deltaSeconds > 0) {
            nextSpeed = segmentDistance / deltaSeconds;
          }
        }

        setCurrentSpeedMps(nextSpeed);
        lastTimestampRef.current = point.timestamp;

        if (segmentDistance < config.minDistanceDeltaMeters) {
          return prev;
        }

        totalDistanceRef.current += segmentDistance;
        return [...prev, point];
      });
    },
    [config.minDistanceDeltaMeters],
  );

  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS !== 'android') {
      setHasLocationPermission(true);
      return true;
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Permiso de ubicación',
        message: 'GeoZone necesita tu ubicación para registrar la actividad en vivo.',
        buttonPositive: 'Aceptar',
        buttonNegative: 'Cancelar',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      setHasLocationPermission(false);
      return false;
    }

    const allowed = granted === PermissionsAndroid.RESULTS.GRANTED;
    setHasLocationPermission(allowed);
    return allowed;
  }, []);

  const handleLocationError = useCallback((message: string) => {
    setErrorMessage(message);
    setStatus('paused');
    setCurrentSpeedMps(0);
  }, []);

  const getInitialLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      position => {
        const point: TrackingPoint = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp,
          speed: position.coords.speed,
        };

        setErrorMessage(null);
        appendPoint(point);
        setStatus('running');
      },
      error => {
        handleLocationError(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      },
    );
  }, [appendPoint, handleLocationError]);

  const startWatchingLocation = useCallback(() => {
    if (!hasLocationPermission || status !== 'running') {
      return;
    }

    if (watchIdRef.current !== null) {
      return;
    }

    watchIdRef.current = Geolocation.watchPosition(
      position => {
        const point: TrackingPoint = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp,
          speed: position.coords.speed,
        };

        setErrorMessage(null);
        appendPoint(point);
      },
      error => {
        setErrorMessage(error.message);
        setCurrentSpeedMps(0);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 1000,
        fastestInterval: 1000,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  }, [appendPoint, hasLocationPermission, status]);

  const ensureLocationReady = useCallback(async () => {
    const granted = await requestLocationPermission();

    if (!granted) {
      setStatus('paused');
      setErrorMessage('Permiso de ubicación denegado o GPS no disponible.');

      if (Platform.OS === 'android') {
        Linking.openSettings().catch(() => {});
      }

      return;
    }

    getInitialLocation();
  }, [getInitialLocation, requestLocationPermission]);

  useEffect(() => {
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
      locationProvider: 'playServices',
    });

    return () => {
      clearLocationWatch();
    };
  }, [clearLocationWatch]);

  useFocusEffect(
    useCallback(() => {
      ensureLocationReady();

      return () => {
        clearLocationWatch();
      };
    }, [clearLocationWatch, ensureLocationReady]),
  );

  useEffect(() => {
    if (status !== 'running') {
      return;
    }

    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (status === 'running') {
      startWatchingLocation();
      return;
    }

    clearLocationWatch();
  }, [clearLocationWatch, startWatchingLocation, status]);

  const handlePauseResume = useCallback(async () => {
    if (status === 'running') {
      setStatus('paused');
      setCurrentSpeedMps(0);
      return;
    }

    if (status === 'paused') {
      await ensureLocationReady();
    }
  }, [ensureLocationReady, status]);

  const handleFinish = useCallback(() => {
    clearLocationWatch();
    setStatus('finished');
    setCurrentSpeedMps(0);

    setSummaryData({
      time: formatElapsed(elapsedSeconds),
      distance: `${formatDistanceKm(totalDistanceRef.current)} km`,
      speed: `${averageSpeedKmh} km/h`,
    });

    setSummaryVisible(true);
  }, [averageSpeedKmh, clearLocationWatch, elapsedSeconds]);

  const closeSummary = useCallback(() => {
    setSummaryVisible(false);
  }, []);

  return {
    activityType,
    status,
    elapsedSeconds,
    elapsedLabel: formatElapsed(elapsedSeconds),
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