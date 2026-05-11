import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation, {
  GeoPosition,
  GeoError,
} from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  startTrackingBackgroundRunner,
  stopTrackingBackgroundRunner,
  updateTrackingBackgroundRunner,
  type ActivityType,
} from './backgroundRunner';

export type TrackingLocation = {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number | null;
  speed: number | null;
  heading: number | null;
  timestamp: number;
};

export type TrackingSnapshot = {
  activityType: ActivityType;
  isActive: boolean;
  isPaused: boolean;
  isFinished: boolean;
  startedAt: number;
  pausedAt: number | null;
  finishedAt: number | null;
  lastUpdatedAt: number;
  elapsedMs: number;
  distanceMeters: number;
  speedMps: number;
  speedKmh: number;
  ascentMeters: number;
  altitudeMeters: number | null;
  lastLocation: TrackingLocation | null;
  route: TrackingLocation[];
};

type TrackerListener = (snapshot: TrackingSnapshot) => void;

const TRACKING_STORAGE_KEY = '@geozone/tracking-session:v1';

const MIN_DISTANCE_METERS = 3;
const MAX_ACCEPTED_ACCURACY_METERS = 80;
const MIN_ASCENT_DELTA_METERS = 1.5;
const MAX_ASCENT_DELTA_METERS = 30;

let currentSnapshot: TrackingSnapshot | null = null;
let listeners = new Set<TrackerListener>();
let watchId: number | null = null;
let tickInterval: ReturnType<typeof setInterval> | null = null;

let activeStartedAt: number | null = null;
let accumulatedElapsedMs = 0;

const notifyListeners = (snapshot: TrackingSnapshot) => {
  listeners.forEach(listener => {
    try {
      listener(snapshot);
    } catch (error) {
      console.warn('[GeoZone][tracker] Error notificando listener:', error);
    }
  });
};

const persistSnapshot = async (snapshot: TrackingSnapshot) => {
  try {
    await AsyncStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(snapshot));
  } catch (error) {
    console.warn('[GeoZone][tracker] No se pudo guardar sesión:', error);
  }
};

const publishSnapshot = async (snapshot: TrackingSnapshot) => {
  currentSnapshot = snapshot;
  notifyListeners(snapshot);
  await persistSnapshot(snapshot);
  await updateTrackingBackgroundRunner(snapshot);
};

const buildInitialSnapshot = (activityType: ActivityType): TrackingSnapshot => {
  const now = Date.now();

  return {
    activityType,
    isActive: true,
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

const normalizePosition = (position: GeoPosition): TrackingLocation => {
  const {coords, timestamp} = position;

  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
    altitude:
      typeof coords.altitude === 'number' && Number.isFinite(coords.altitude)
        ? coords.altitude
        : null,
    accuracy:
      typeof coords.accuracy === 'number' && Number.isFinite(coords.accuracy)
        ? coords.accuracy
        : null,
    speed:
      typeof coords.speed === 'number' && Number.isFinite(coords.speed)
        ? coords.speed
        : null,
    heading:
      typeof coords.heading === 'number' && Number.isFinite(coords.heading)
        ? coords.heading
        : null,
    timestamp: typeof timestamp === 'number' ? timestamp : Date.now(),
  };
};

const toRadians = (value: number) => {
  return (value * Math.PI) / 180;
};

const calculateDistanceMeters = (
  from: TrackingLocation,
  to: TrackingLocation,
) => {
  const earthRadiusMeters = 6371000;

  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLon = toRadians(to.longitude - from.longitude);

  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMeters * c;
};

const getElapsedMs = () => {
  if (!activeStartedAt) {
    return accumulatedElapsedMs;
  }

  return accumulatedElapsedMs + (Date.now() - activeStartedAt);
};

const refreshElapsedTick = async () => {
  if (!currentSnapshot || currentSnapshot.isPaused || currentSnapshot.isFinished) {
    return;
  }

  const elapsedMs = getElapsedMs();

  await publishSnapshot({
    ...currentSnapshot,
    elapsedMs,
    lastUpdatedAt: Date.now(),
  });
};

const startTicker = () => {
  if (tickInterval) {
    clearInterval(tickInterval);
  }

  tickInterval = setInterval(() => {
    refreshElapsedTick();
  }, 1000);
};

const stopTicker = () => {
  if (tickInterval) {
    clearInterval(tickInterval);
    tickInterval = null;
  }
};

const stopLocationWatch = () => {
  if (watchId !== null) {
    Geolocation.clearWatch(watchId);
    watchId = null;
  }
};

const requestAndroidPermissions = async () => {
  const fineLocation = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (fineLocation !== PermissionsAndroid.RESULTS.GRANTED) {
    return false;
  }

  if (Platform.Version >= 29) {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    );
  }

  return true;
};

export const requestTrackingPermissions = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    return await requestAndroidPermissions();
  } catch (error) {
    console.warn('[GeoZone][tracker] Error solicitando permisos:', error);
    return false;
  }
};

const shouldIgnoreLocation = (
  previousLocation: TrackingLocation | null,
  nextLocation: TrackingLocation,
) => {
  if (
    nextLocation.accuracy !== null &&
    nextLocation.accuracy > MAX_ACCEPTED_ACCURACY_METERS
  ) {
    return true;
  }

  if (!previousLocation) {
    return false;
  }

  const distance = calculateDistanceMeters(previousLocation, nextLocation);

  return distance < MIN_DISTANCE_METERS;
};

const calculateSpeedMps = (
  previousLocation: TrackingLocation | null,
  nextLocation: TrackingLocation,
  segmentDistanceMeters: number,
) => {
  if (
    typeof nextLocation.speed === 'number' &&
    Number.isFinite(nextLocation.speed) &&
    nextLocation.speed >= 0
  ) {
    return nextLocation.speed;
  }

  if (!previousLocation) {
    return 0;
  }

  const deltaSeconds =
    (nextLocation.timestamp - previousLocation.timestamp) / 1000;

  if (deltaSeconds <= 0) {
    return 0;
  }

  return Math.max(0, segmentDistanceMeters / deltaSeconds);
};

const calculateAscentMeters = (
  previousLocation: TrackingLocation | null,
  nextLocation: TrackingLocation,
) => {
  if (
    !previousLocation ||
    previousLocation.altitude === null ||
    nextLocation.altitude === null
  ) {
    return 0;
  }

  const deltaAltitude = nextLocation.altitude - previousLocation.altitude;

  if (
    deltaAltitude > MIN_ASCENT_DELTA_METERS &&
    deltaAltitude < MAX_ASCENT_DELTA_METERS
  ) {
    return deltaAltitude;
  }

  return 0;
};

const handlePosition = async (position: GeoPosition) => {
  if (!currentSnapshot || currentSnapshot.isPaused || currentSnapshot.isFinished) {
    return;
  }

  const nextLocation = normalizePosition(position);
  const previousLocation = currentSnapshot.lastLocation;

  if (shouldIgnoreLocation(previousLocation, nextLocation)) {
    return;
  }

  const segmentDistanceMeters = previousLocation
    ? calculateDistanceMeters(previousLocation, nextLocation)
    : 0;

  const segmentAscentMeters = calculateAscentMeters(
    previousLocation,
    nextLocation,
  );

  const speedMps = calculateSpeedMps(
    previousLocation,
    nextLocation,
    segmentDistanceMeters,
  );

  const distanceMeters =
    currentSnapshot.distanceMeters + segmentDistanceMeters;

  const ascentMeters =
    currentSnapshot.ascentMeters + segmentAscentMeters;

  const elapsedMs = getElapsedMs();

  const updatedSnapshot: TrackingSnapshot = {
    ...currentSnapshot,
    elapsedMs,
    distanceMeters,
    speedMps,
    speedKmh: speedMps * 3.6,
    ascentMeters,
    altitudeMeters: nextLocation.altitude,
    lastLocation: nextLocation,
    lastUpdatedAt: Date.now(),
    route: [...currentSnapshot.route, nextLocation],
  };

  await publishSnapshot(updatedSnapshot);
};

const handlePositionError = (error: GeoError) => {
  console.warn('[GeoZone][tracker] Error GPS:', error);
};

const startLocationWatch = () => {
  stopLocationWatch();

  watchId = Geolocation.watchPosition(handlePosition, handlePositionError, {
    enableHighAccuracy: true,
    distanceFilter: 2,
    interval: 3000,
    fastestInterval: 1500,
    showsBackgroundLocationIndicator: true,
    forceRequestLocation: true,
  });
};

export const startTracking = async (activityType: ActivityType) => {
  const hasPermissions = await requestTrackingPermissions();

  if (!hasPermissions) {
    throw new Error('No se otorgaron permisos de ubicación.');
  }

  stopTicker();
  stopLocationWatch();

  const snapshot = buildInitialSnapshot(activityType);

  currentSnapshot = snapshot;
  accumulatedElapsedMs = 0;
  activeStartedAt = Date.now();

  await persistSnapshot(snapshot);
  notifyListeners(snapshot);

  await startTrackingBackgroundRunner(activityType, snapshot);

  startLocationWatch();
  startTicker();

  return snapshot;
};

export const pauseTracking = async () => {
  if (!currentSnapshot || currentSnapshot.isPaused || currentSnapshot.isFinished) {
    return currentSnapshot;
  }

  accumulatedElapsedMs = getElapsedMs();
  activeStartedAt = null;

  stopLocationWatch();

  const pausedSnapshot: TrackingSnapshot = {
    ...currentSnapshot,
    isPaused: true,
    pausedAt: Date.now(),
    elapsedMs: accumulatedElapsedMs,
    speedMps: 0,
    speedKmh: 0,
    lastUpdatedAt: Date.now(),
  };

  await publishSnapshot(pausedSnapshot);

  return pausedSnapshot;
};

export const resumeTracking = async () => {
  if (!currentSnapshot || !currentSnapshot.isPaused || currentSnapshot.isFinished) {
    return currentSnapshot;
  }

  activeStartedAt = Date.now();

  const resumedSnapshot: TrackingSnapshot = {
    ...currentSnapshot,
    isPaused: false,
    pausedAt: null,
    lastUpdatedAt: Date.now(),
  };

  await publishSnapshot(resumedSnapshot);

  startLocationWatch();
  startTicker();

  return resumedSnapshot;
};

export const finishTracking = async () => {
  if (!currentSnapshot) {
    await stopTrackingBackgroundRunner();
    stopTicker();
    stopLocationWatch();
    return null;
  }

  accumulatedElapsedMs = getElapsedMs();
  activeStartedAt = null;

  stopTicker();
  stopLocationWatch();

  const finishedSnapshot: TrackingSnapshot = {
    ...currentSnapshot,
    isActive: false,
    isPaused: false,
    isFinished: true,
    finishedAt: Date.now(),
    elapsedMs: accumulatedElapsedMs,
    speedMps: 0,
    speedKmh: 0,
    lastUpdatedAt: Date.now(),
  };

  currentSnapshot = finishedSnapshot;
  notifyListeners(finishedSnapshot);
  await persistSnapshot(finishedSnapshot);
  await stopTrackingBackgroundRunner();

  return finishedSnapshot;
};

export const stopTracking = async () => {
  stopTicker();
  stopLocationWatch();

  activeStartedAt = null;
  accumulatedElapsedMs = 0;
  currentSnapshot = null;

  try {
    await AsyncStorage.removeItem(TRACKING_STORAGE_KEY);
  } catch (error) {
    console.warn('[GeoZone][tracker] No se pudo limpiar sesión:', error);
  }

  await stopTrackingBackgroundRunner();
};

export const getTrackingSnapshot = () => {
  return currentSnapshot;
};

export const loadTrackingSnapshot = async () => {
  try {
    const rawValue = await AsyncStorage.getItem(TRACKING_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const snapshot = JSON.parse(rawValue) as TrackingSnapshot;
    currentSnapshot = snapshot;

    if (snapshot.isActive && !snapshot.isPaused && !snapshot.isFinished) {
      accumulatedElapsedMs = snapshot.elapsedMs;
      activeStartedAt = Date.now();

      await startTrackingBackgroundRunner(snapshot.activityType, snapshot);
      startLocationWatch();
      startTicker();
    }

    return snapshot;
  } catch (error) {
    console.warn('[GeoZone][tracker] No se pudo cargar sesión:', error);
    return null;
  }
};

export const subscribeTracking = (listener: TrackerListener) => {
  listeners.add(listener);

  if (currentSnapshot) {
    listener(currentSnapshot);
  }

  return () => {
    listeners.delete(listener);
  };
};

export const subscribeTrackingSnapshot = subscribeTracking;

export const clearTrackingSession = async () => {
  await stopTracking();
};

export const getTrackingStorageKey = () => {
  return TRACKING_STORAGE_KEY;
};
