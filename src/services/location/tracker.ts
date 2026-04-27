import {Platform} from 'react-native';
import Geolocation, {
  type GeoError,
  type GeoPosition,
} from 'react-native-geolocation-service';

import type {ActivityType, TrackingPoint} from '../../features/tracking/types';
import {
  createIdleTrackingSnapshot,
  loadTrackingSession,
  saveTrackingSession,
  type TrackingSnapshot,
} from './sessionStore';

const MIN_ROUTE_DISTANCE_METERS = 3;
const MAX_ACCEPTABLE_ACCURACY_METERS = 120;
const MIN_ASCENT_DELTA_METERS = 1.5;
const MAX_ALTITUDE_ACCURACY_METERS = 35;
const MAX_ROUTE_POINTS = 5000;

let currentSnapshot: TrackingSnapshot = createIdleTrackingSnapshot();
let hasHydrated = false;
let watchId: number | null = null;

const isFiniteNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value);
};

const now = () => Date.now();

const clampPositive = (value: number) => {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
};

function getLiveElapsedMs(snapshot: TrackingSnapshot): number {
  if (!snapshot.isActive || snapshot.isPaused || !snapshot.startedAt) {
    return clampPositive(snapshot.elapsedMs);
  }

  return clampPositive(snapshot.elapsedMs + (now() - snapshot.startedAt));
}

function cloneSnapshot(snapshot: TrackingSnapshot): TrackingSnapshot {
  return {
    ...snapshot,
    elapsedMs: getLiveElapsedMs(snapshot),
    route: [...snapshot.route],
    lastPoint: snapshot.lastPoint ? {...snapshot.lastPoint} : null,
    location: snapshot.location ? {...snapshot.location} : null,
  };
}

async function persistSnapshot() {
  try {
    await saveTrackingSession(currentSnapshot);
  } catch (error) {
    if (__DEV__) {
      console.warn('[tracker] No se pudo guardar la sesión:', error);
    }
  }
}

function stopWatch() {
  if (watchId !== null) {
    Geolocation.clearWatch(watchId);
    watchId = null;
  }

  try {
    Geolocation.stopObserving();
  } catch {
    // Android puede lanzar error si no hay observers activos.
  }
}

function toTrackingPoint(position: GeoPosition): TrackingPoint | null {
  const {coords} = position;

  if (!isFiniteNumber(coords.latitude) || !isFiniteNumber(coords.longitude)) {
    return null;
  }

  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
    timestamp: isFiniteNumber(position.timestamp) ? position.timestamp : now(),
    accuracy: isFiniteNumber(coords.accuracy) ? coords.accuracy : null,
    altitude: isFiniteNumber(coords.altitude) ? coords.altitude : null,
    altitudeAccuracy: isFiniteNumber(coords.altitudeAccuracy)
      ? coords.altitudeAccuracy
      : null,
    heading: isFiniteNumber(coords.heading) ? coords.heading : null,
    speed: isFiniteNumber(coords.speed) ? coords.speed : null,
  };
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function getDistanceMeters(
  previousPoint: TrackingPoint | null,
  nextPoint: TrackingPoint,
): number {
  if (!previousPoint) {
    return 0;
  }

  const earthRadiusMeters = 6371000;

  const dLat = toRadians(nextPoint.latitude - previousPoint.latitude);
  const dLon = toRadians(nextPoint.longitude - previousPoint.longitude);

  const lat1 = toRadians(previousPoint.latitude);
  const lat2 = toRadians(nextPoint.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMeters * c;
}

function hasReliableAccuracy(point: TrackingPoint): boolean {
  if (!isFiniteNumber(point.accuracy)) {
    return true;
  }

  return point.accuracy <= MAX_ACCEPTABLE_ACCURACY_METERS;
}

function shouldAddRoutePoint(
  previousRoutePoint: TrackingPoint | null,
  nextPoint: TrackingPoint,
): boolean {
  if (!hasReliableAccuracy(nextPoint)) {
    return false;
  }

  if (!previousRoutePoint) {
    return true;
  }

  const distance = getDistanceMeters(previousRoutePoint, nextPoint);
  return distance >= MIN_ROUTE_DISTANCE_METERS;
}

function getAltitude(point: TrackingPoint | null): number | null {
  if (!point || !isFiniteNumber(point.altitude)) {
    return null;
  }

  if (
    isFiniteNumber(point.altitudeAccuracy) &&
    point.altitudeAccuracy > MAX_ALTITUDE_ACCURACY_METERS
  ) {
    return null;
  }

  return point.altitude;
}

function getAscentDelta(
  previousPoint: TrackingPoint | null,
  nextPoint: TrackingPoint,
): number {
  const previousAltitude = getAltitude(previousPoint);
  const nextAltitude = getAltitude(nextPoint);

  if (previousAltitude === null || nextAltitude === null) {
    return 0;
  }

  const delta = nextAltitude - previousAltitude;

  if (delta < MIN_ASCENT_DELTA_METERS) {
    return 0;
  }

  return delta;
}

function getSpeedMps(
  previousLocation: TrackingPoint | null,
  nextPoint: TrackingPoint,
): number {
  if (isFiniteNumber(nextPoint.speed) && nextPoint.speed > 0) {
    return nextPoint.speed;
  }

  if (!previousLocation) {
    return 0;
  }

  const distanceMeters = getDistanceMeters(previousLocation, nextPoint);
  const deltaSeconds = Math.max(
    0,
    (nextPoint.timestamp - previousLocation.timestamp) / 1000,
  );

  if (deltaSeconds <= 0) {
    return 0;
  }

  return distanceMeters / deltaSeconds;
}

function trimRoute(route: TrackingPoint[]): TrackingPoint[] {
  if (route.length <= MAX_ROUTE_POINTS) {
    return route;
  }

  return route.slice(route.length - MAX_ROUTE_POINTS);
}

function handlePosition(position: GeoPosition) {
  const nextPoint = toTrackingPoint(position);

  if (!nextPoint) {
    return;
  }

  if (
    !currentSnapshot.isActive ||
    currentSnapshot.isPaused ||
    currentSnapshot.isFinished
  ) {
    return;
  }

  const previousLocation = currentSnapshot.location;
  const previousRoutePoint = currentSnapshot.lastPoint;
  const addToRoute = shouldAddRoutePoint(previousRoutePoint, nextPoint);

  const nextSpeedMps = getSpeedMps(previousLocation, nextPoint);
  const nextAltitudeMeters =
    getAltitude(nextPoint) ?? currentSnapshot.altitudeMeters ?? null;

  let nextDistanceMeters = currentSnapshot.distanceMeters;
  let nextAscentMeters = currentSnapshot.ascentMeters;
  let nextLastPoint = currentSnapshot.lastPoint;
  let nextRoute = currentSnapshot.route;

  if (addToRoute) {
    const segmentDistance = getDistanceMeters(previousRoutePoint, nextPoint);

    nextDistanceMeters += segmentDistance;
    nextAscentMeters += getAscentDelta(previousRoutePoint, nextPoint);
    nextLastPoint = nextPoint;
    nextRoute = trimRoute([...currentSnapshot.route, nextPoint]);
  }

  currentSnapshot = {
    ...currentSnapshot,
    distanceMeters: clampPositive(nextDistanceMeters),
    speedMps: clampPositive(nextSpeedMps),
    ascentMeters: clampPositive(nextAscentMeters),
    altitudeMeters: nextAltitudeMeters,
    hasLocation: true,
    errorCode: null,
    lastPoint: nextLastPoint,
    location: nextPoint,
    route: nextRoute,
    lastUpdatedAt: now(),
  };

  void persistSnapshot();
}

function handleLocationError(error: GeoError) {
  currentSnapshot = {
    ...currentSnapshot,
    errorCode: String(error.code),
    lastUpdatedAt: now(),
  };

  void persistSnapshot();

  if (__DEV__) {
    console.warn('[tracker] Error GPS:', error.code, error.message);
  }
}

function startWatch() {
  stopWatch();

  const commonOptions = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 1000,
    distanceFilter: 1,
    showLocationDialog: true,
    forceRequestLocation: true,
  };

  Geolocation.getCurrentPosition(handlePosition, handleLocationError, {
    ...commonOptions,
    timeout: 15000,
  });

  watchId = Geolocation.watchPosition(handlePosition, handleLocationError, {
    ...commonOptions,
    interval: 2000,
    fastestInterval: 1000,
    useSignificantChanges: false,
    showsBackgroundLocationIndicator: Platform.OS === 'ios',
  });
}

export async function hydrateTrackerFromStorage() {
  if (hasHydrated) {
    return;
  }

  const storedSnapshot = await loadTrackingSession();

  if (storedSnapshot) {
    currentSnapshot = storedSnapshot;
  } else {
    currentSnapshot = createIdleTrackingSnapshot();
  }

  hasHydrated = true;

  if (
    currentSnapshot.isActive &&
    !currentSnapshot.isPaused &&
    !currentSnapshot.isFinished
  ) {
    startWatch();
  }
}

export async function startTracker(activityType: ActivityType = 'run') {
  await hydrateTrackerFromStorage();

  const startedAt = now();

  currentSnapshot = {
    ...createIdleTrackingSnapshot(activityType),
    isActive: true,
    isPaused: false,
    isFinished: false,
    startedAt,
    pausedAt: null,
    finishedAt: null,
    lastUpdatedAt: startedAt,
    elapsedMs: 0,
    totalPausedMs: 0,
    errorCode: null,
  };

  await persistSnapshot();
  startWatch();

  return getTrackerSnapshot();
}

export async function pauseTracker() {
  await hydrateTrackerFromStorage();

  if (
    !currentSnapshot.isActive ||
    currentSnapshot.isPaused ||
    currentSnapshot.isFinished
  ) {
    return getTrackerSnapshot();
  }

  const pausedAt = now();
  const elapsedMs = getLiveElapsedMs(currentSnapshot);

  stopWatch();

  currentSnapshot = {
    ...currentSnapshot,
    isPaused: true,
    pausedAt,
    startedAt: null,
    elapsedMs,
    speedMps: 0,
    lastUpdatedAt: pausedAt,
  };

  await persistSnapshot();

  return getTrackerSnapshot();
}

export async function resumeTracker() {
  await hydrateTrackerFromStorage();

  if (
    !currentSnapshot.isActive ||
    !currentSnapshot.isPaused ||
    currentSnapshot.isFinished
  ) {
    return getTrackerSnapshot();
  }

  const resumedAt = now();
  const pausedAt = currentSnapshot.pausedAt ?? resumedAt;
  const pausedDeltaMs = Math.max(0, resumedAt - pausedAt);

  currentSnapshot = {
    ...currentSnapshot,
    isPaused: false,
    pausedAt: null,
    startedAt: resumedAt,
    totalPausedMs: currentSnapshot.totalPausedMs + pausedDeltaMs,
    lastUpdatedAt: resumedAt,
    errorCode: null,
  };

  await persistSnapshot();
  startWatch();

  return getTrackerSnapshot();
}

export async function finishTracker() {
  await hydrateTrackerFromStorage();

  const finishedAt = now();
  const elapsedMs = getLiveElapsedMs(currentSnapshot);

  stopWatch();

  currentSnapshot = {
    ...currentSnapshot,
    isActive: false,
    isPaused: false,
    isFinished: true,
    startedAt: null,
    pausedAt: null,
    finishedAt,
    elapsedMs,
    speedMps: 0,
    lastUpdatedAt: finishedAt,
  };

  await persistSnapshot();

  return getTrackerSnapshot();
}

export function getTrackerSnapshot(): TrackingSnapshot {
  return cloneSnapshot(currentSnapshot);
}

export async function clearTrackerRuntime() {
  stopWatch();
  currentSnapshot = createIdleTrackingSnapshot();
  await persistSnapshot();
}