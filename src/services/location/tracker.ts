import Geolocation, {
  type GeoError,
  type GeoPosition,
  type GeoWatchOptions,
} from 'react-native-geolocation-service';

import {
  type ActivityType,
  type TrackingPoint,
  type TrackingSnapshot,
  createIdleTrackingSnapshot,
} from './sessionStore';

import {
  readTrackingSession,
  writeTrackingSession,
  clearTrackingSession,
} from './storage';

import {
  ensureNotificationChannel,
  showTrackingNotification,
  clearTrackingNotification,
} from './notifications';

type TrackerListener = (snapshot: TrackingSnapshot) => void;

type TrackerSession = {
  watchId: number | null;
  currentSnapshot: TrackingSnapshot;
  listeners: Set<TrackerListener>;
  elapsedTimer: ReturnType<typeof setInterval> | null;
  lastPersistedAt: number;
};

const TRACKING_NOTIFICATION_ID = 'geozone-tracking-active';
const TRACKING_CHANNEL_ID = 'geozone-tracking';

const MIN_RECORD_DISTANCE_METERS = 4;
const MAX_ALLOWED_ACCURACY_METERS = 120;
const MAX_SEGMENT_DISTANCE_METERS = 250;
const MIN_ASCENT_DELTA_METERS = 1;

/**
 * Umbral para evitar ruido GPS estando quieto.
 *
 * 0.25 m/s = 0.9 km/h aprox.
 * Si el GPS reporta menos que esto, para la app es velocidad 0.
 */
const GPS_STATIONARY_THRESHOLD_MPS = 0.25;

/**
 * Cuando el GPS no entrega speed confiable, usamos velocidad por segmento,
 * pero también filtrada para evitar que el temblor del GPS parezca movimiento.
 */
const FALLBACK_SEGMENT_SPEED_THRESHOLD_MPS = 0.35;

const trackerSession: TrackerSession = {
  watchId: null,
  currentSnapshot: createIdleTrackingSnapshot(),
  listeners: new Set<TrackerListener>(),
  elapsedTimer: null,
  lastPersistedAt: 0,
};

const WATCH_OPTIONS: GeoWatchOptions = {
  enableHighAccuracy: true,
  distanceFilter: 3,
  interval: 3000,
  fastestInterval: 1500,
  forceRequestLocation: true,
  showLocationDialog: true,
};

const INITIAL_POSITION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 5000,
  forceRequestLocation: true,
  showLocationDialog: true,
};

function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function toSafeNumber(value: unknown): number | null {
  return isValidNumber(value) ? value : null;
}

function normalizeSpeedMps(value: unknown): number | null {
  if (!isValidNumber(value)) {
    return null;
  }

  if (value <= GPS_STATIONARY_THRESHOLD_MPS) {
    return 0;
  }

  return value;
}

function clonePoint(point: TrackingPoint): TrackingPoint {
  return {
    latitude: point.latitude,
    longitude: point.longitude,
    timestamp: point.timestamp,
    accuracy: point.accuracy,
    altitude: point.altitude,
    altitudeAccuracy: point.altitudeAccuracy,
    heading: point.heading,
    speed: point.speed,
  };
}

function getElapsedMs(snapshot: TrackingSnapshot, now = Date.now()) {
  if (!snapshot.startedAt) {
    return snapshot.elapsedMs;
  }

  if (!snapshot.isActive || snapshot.isPaused || snapshot.isFinished) {
    return snapshot.elapsedMs;
  }

  return snapshot.elapsedMs + Math.max(0, now - snapshot.startedAt);
}

function cloneSnapshot(
  snapshot: TrackingSnapshot,
  options?: {includeLiveElapsed?: boolean},
): TrackingSnapshot {
  return {
    ...snapshot,
    elapsedMs: options?.includeLiveElapsed
      ? getElapsedMs(snapshot)
      : snapshot.elapsedMs,
    route: snapshot.route.map(clonePoint),
    lastPoint: snapshot.lastPoint ? clonePoint(snapshot.lastPoint) : null,
    location: snapshot.location ? clonePoint(snapshot.location) : null,
  };
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function calculateDistanceMeters(from: TrackingPoint, to: TrackingPoint) {
  const earthRadius = 6371000;
  const latDelta = toRadians(to.latitude - from.latitude);
  const lonDelta = toRadians(to.longitude - from.longitude);
  const fromLat = toRadians(from.latitude);
  const toLat = toRadians(to.latitude);

  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(fromLat) *
      Math.cos(toLat) *
      Math.sin(lonDelta / 2) *
      Math.sin(lonDelta / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

function calculateSegmentSpeedMps(
  previousPoint: TrackingPoint | null,
  nextPoint: TrackingPoint,
) {
  if (!previousPoint) {
    return 0;
  }

  const distanceMeters = calculateDistanceMeters(previousPoint, nextPoint);
  const seconds = Math.max(
    1,
    Math.abs(nextPoint.timestamp - previousPoint.timestamp) / 1000,
  );

  return distanceMeters / seconds;
}

function getMaxReasonableSpeedMps(activityType: ActivityType) {
  switch (activityType) {
    case 'ride':
      return 25;

    case 'pet':
      return 5.5;

    case 'run':
    default:
      return 8.5;
  }
}

function shouldUsePoint(point: TrackingPoint) {
  if (!isValidNumber(point.latitude) || !isValidNumber(point.longitude)) {
    return false;
  }

  if (
    isValidNumber(point.accuracy) &&
    point.accuracy > MAX_ALLOWED_ACCURACY_METERS
  ) {
    return false;
  }

  return true;
}

function shouldRecordMovement(
  activityType: ActivityType,
  previousPoint: TrackingPoint | null,
  nextPoint: TrackingPoint,
) {
  if (!previousPoint) {
    return true;
  }

  const distanceMeters = calculateDistanceMeters(previousPoint, nextPoint);

  if (distanceMeters < MIN_RECORD_DISTANCE_METERS) {
    return false;
  }

  if (distanceMeters > MAX_SEGMENT_DISTANCE_METERS) {
    const segmentSpeedMps = calculateSegmentSpeedMps(previousPoint, nextPoint);

    if (segmentSpeedMps > getMaxReasonableSpeedMps(activityType)) {
      return false;
    }
  }

  const previousAccuracy = isValidNumber(previousPoint.accuracy)
    ? previousPoint.accuracy
    : 0;

  const nextAccuracy = isValidNumber(nextPoint.accuracy)
    ? nextPoint.accuracy
    : 0;

  const worstAccuracy = Math.max(previousAccuracy, nextAccuracy);

  if (worstAccuracy > 25 && distanceMeters < worstAccuracy * 0.7) {
    return false;
  }

  const segmentSpeedMps = calculateSegmentSpeedMps(previousPoint, nextPoint);

  return segmentSpeedMps <= getMaxReasonableSpeedMps(activityType);
}

function updateAscent(
  previousPoint: TrackingPoint | null,
  nextPoint: TrackingPoint,
) {
  if (!previousPoint) {
    return trackerSession.currentSnapshot.ascentMeters;
  }

  const previousAltitude = toSafeNumber(previousPoint.altitude);
  const nextAltitude = toSafeNumber(nextPoint.altitude);

  if (previousAltitude === null || nextAltitude === null) {
    return trackerSession.currentSnapshot.ascentMeters;
  }

  const previousAltitudeAccuracy = toSafeNumber(previousPoint.altitudeAccuracy);
  const nextAltitudeAccuracy = toSafeNumber(nextPoint.altitudeAccuracy);

  if (
    (previousAltitudeAccuracy !== null && previousAltitudeAccuracy > 30) ||
    (nextAltitudeAccuracy !== null && nextAltitudeAccuracy > 30)
  ) {
    return trackerSession.currentSnapshot.ascentMeters;
  }

  const delta = nextAltitude - previousAltitude;

  if (delta >= MIN_ASCENT_DELTA_METERS) {
    return trackerSession.currentSnapshot.ascentMeters + delta;
  }

  return trackerSession.currentSnapshot.ascentMeters;
}

async function persistSnapshot(force = false) {
  const now = Date.now();

  if (!force && now - trackerSession.lastPersistedAt < 1200) {
    return;
  }

  try {
    const snapshotToPersist = cloneSnapshot(trackerSession.currentSnapshot, {
      includeLiveElapsed: false,
    });

    await writeTrackingSession(snapshotToPersist);
    trackerSession.lastPersistedAt = now;
  } catch (error) {
    if (__DEV__) {
      console.warn('[tracker] persistSnapshot error', error);
    }
  }
}

async function refreshNotification(snapshot: TrackingSnapshot) {
  try {
    if (!snapshot.isActive || snapshot.isFinished) {
      await clearTrackingNotification(TRACKING_NOTIFICATION_ID);
      return;
    }

    await ensureNotificationChannel(TRACKING_CHANNEL_ID);

    await showTrackingNotification({
      notificationId: TRACKING_NOTIFICATION_ID,
      channelId: TRACKING_CHANNEL_ID,
      activityType: snapshot.activityType,
      elapsedMs: getElapsedMs(snapshot),
      distanceMeters: snapshot.distanceMeters,
      speedMps: snapshot.speedMps,
      ascentMeters: snapshot.ascentMeters,
      isPaused: snapshot.isPaused,
    });
  } catch (error) {
    if (__DEV__) {
      console.warn('[tracker] refreshNotification error', error);
    }
  }
}

function emitSnapshot() {
  const cloned = cloneSnapshot(trackerSession.currentSnapshot, {
    includeLiveElapsed: true,
  });

  trackerSession.listeners.forEach(listener => {
    listener(cloned);
  });
}

function stopElapsedTick() {
  if (trackerSession.elapsedTimer) {
    clearInterval(trackerSession.elapsedTimer);
    trackerSession.elapsedTimer = null;
  }
}

function scheduleElapsedTick() {
  stopElapsedTick();

  const snapshot = trackerSession.currentSnapshot;

  if (!snapshot.isActive || snapshot.isPaused || snapshot.isFinished) {
    return;
  }

  trackerSession.elapsedTimer = setInterval(() => {
    emitSnapshot();
    void refreshNotification(trackerSession.currentSnapshot);
  }, 1000);
}

async function notifySnapshotChanged(forcePersist = false) {
  emitSnapshot();
  await persistSnapshot(forcePersist);
  await refreshNotification(trackerSession.currentSnapshot);
}

function createPointFromPosition(position: GeoPosition): TrackingPoint {
  const timestamp = Number(position.timestamp ?? Date.now());
  const gpsSpeedMps = normalizeSpeedMps(position.coords.speed);

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    timestamp: Number.isFinite(timestamp) ? timestamp : Date.now(),
    accuracy: toSafeNumber(position.coords.accuracy),
    altitude: toSafeNumber(position.coords.altitude),
    altitudeAccuracy: toSafeNumber(position.coords.altitudeAccuracy),
    heading: toSafeNumber(position.coords.heading),
    speed: gpsSpeedMps,
  };
}

function stopWatchingPosition() {
  if (trackerSession.watchId !== null) {
    Geolocation.clearWatch(trackerSession.watchId);
    trackerSession.watchId = null;
  }

  Geolocation.stopObserving();
}

function handleWatchError(error?: GeoError) {
  trackerSession.currentSnapshot = {
    ...trackerSession.currentSnapshot,
    errorCode: error?.code ? String(error.code) : 'LOCATION_ERROR',
    speedMps: 0,
    lastUpdatedAt: Date.now(),
  };

  emitSnapshot();

  if (__DEV__) {
    console.warn('[tracker] watchPosition error', error);
  }
}

function startWatchingPosition() {
  stopWatchingPosition();

  Geolocation.getCurrentPosition(
    position => {
      void upsertPosition(position);
    },
    error => {
      handleWatchError(error);
    },
    INITIAL_POSITION_OPTIONS,
  );

  trackerSession.watchId = Geolocation.watchPosition(
    position => {
      void upsertPosition(position);
    },
    error => {
      handleWatchError(error);
    },
    WATCH_OPTIONS,
  );
}

function calculateNextSpeedMps(params: {
  activityType: ActivityType;
  previousPoint: TrackingPoint | null;
  point: TrackingPoint;
  shouldRecord: boolean;
}) {
  const {activityType, previousPoint, point, shouldRecord} = params;

  const gpsSpeedMps = normalizeSpeedMps(point.speed);

  /**
   * Opción B:
   * Primero usamos la velocidad que entrega el GPS.
   * En Android esto viene desde Location.getSpeed() mediante
   * react-native-geolocation-service.
   */
  if (gpsSpeedMps !== null) {
    return Math.min(gpsSpeedMps, getMaxReasonableSpeedMps(activityType));
  }

  /**
   * Si el GPS no entrega velocidad, usamos segmento solo cuando realmente
   * aceptamos el punto como movimiento válido.
   */
  if (!shouldRecord || !previousPoint) {
    return 0;
  }

  const segmentSpeedMps = calculateSegmentSpeedMps(previousPoint, point);

  if (segmentSpeedMps <= FALLBACK_SEGMENT_SPEED_THRESHOLD_MPS) {
    return 0;
  }

  if (segmentSpeedMps > getMaxReasonableSpeedMps(activityType)) {
    return 0;
  }

  return segmentSpeedMps;
}

export async function startTracker(activityType: ActivityType) {
  const now = Date.now();

  trackerSession.currentSnapshot = {
    ...createIdleTrackingSnapshot(activityType),
    isActive: true,
    isPaused: false,
    isFinished: false,
    startedAt: now,
    pausedAt: null,
    finishedAt: null,
    lastUpdatedAt: now,
    activityType,
    errorCode: null,
    speedMps: 0,
  };

  trackerSession.lastPersistedAt = 0;

  scheduleElapsedTick();
  startWatchingPosition();

  await notifySnapshotChanged(true);
}

export async function pauseTracker() {
  const snapshot = trackerSession.currentSnapshot;

  if (!snapshot.isActive || snapshot.isPaused || snapshot.isFinished) {
    return;
  }

  trackerSession.currentSnapshot = {
    ...snapshot,
    isPaused: true,
    pausedAt: Date.now(),
    elapsedMs: getElapsedMs(snapshot),
    startedAt: null,
    speedMps: 0,
    lastUpdatedAt: Date.now(),
  };

  stopWatchingPosition();
  stopElapsedTick();

  await notifySnapshotChanged(true);
}

export async function resumeTracker() {
  const snapshot = trackerSession.currentSnapshot;

  if (!snapshot.isActive || !snapshot.isPaused || snapshot.isFinished) {
    return;
  }

  trackerSession.currentSnapshot = {
    ...snapshot,
    isPaused: false,
    pausedAt: null,
    startedAt: Date.now(),
    speedMps: 0,
    lastUpdatedAt: Date.now(),
    errorCode: null,
  };

  scheduleElapsedTick();
  startWatchingPosition();

  await notifySnapshotChanged(true);
}

export async function finishTracker() {
  const snapshot = trackerSession.currentSnapshot;

  if (!snapshot.isActive || snapshot.isFinished) {
    return;
  }

  trackerSession.currentSnapshot = {
    ...snapshot,
    isActive: false,
    isPaused: false,
    isFinished: true,
    finishedAt: Date.now(),
    elapsedMs: getElapsedMs(snapshot),
    startedAt: null,
    pausedAt: null,
    speedMps: 0,
    lastUpdatedAt: Date.now(),
  };

  stopWatchingPosition();
  stopElapsedTick();

  await notifySnapshotChanged(true);
}

export async function resetTracker(activityType: ActivityType = 'run') {
  stopWatchingPosition();
  stopElapsedTick();

  trackerSession.currentSnapshot = createIdleTrackingSnapshot(activityType);
  trackerSession.lastPersistedAt = 0;

  await clearTrackingSession();
  await clearTrackingNotification(TRACKING_NOTIFICATION_ID);

  emitSnapshot();
}

export async function upsertPosition(position: GeoPosition) {
  const snapshot = trackerSession.currentSnapshot;

  if (!snapshot.isActive || snapshot.isPaused || snapshot.isFinished) {
    return;
  }

  const point = createPointFromPosition(position);

  if (!shouldUsePoint(point)) {
    return;
  }

  const previousAnchorPoint = snapshot.lastPoint;

  const shouldRecord = shouldRecordMovement(
    snapshot.activityType,
    previousAnchorPoint,
    point,
  );

  let nextDistance = snapshot.distanceMeters;
  let nextAscent = snapshot.ascentMeters;
  let nextRoute = snapshot.route;
  let nextLastPoint = snapshot.lastPoint;

  if (shouldRecord) {
    if (previousAnchorPoint) {
      nextDistance += calculateDistanceMeters(previousAnchorPoint, point);
      nextAscent = updateAscent(previousAnchorPoint, point);
    }

    nextRoute = [...snapshot.route, point];
    nextLastPoint = point;
  }

  const nextSpeedMps = calculateNextSpeedMps({
    activityType: snapshot.activityType,
    previousPoint: previousAnchorPoint,
    point,
    shouldRecord,
  });

  trackerSession.currentSnapshot = {
    ...snapshot,
    route: nextRoute,
    lastPoint: nextLastPoint,
    location: point,
    hasLocation: true,
    altitudeMeters: toSafeNumber(point.altitude),
    errorCode: null,
    distanceMeters: nextDistance,
    ascentMeters: nextAscent,
    speedMps: nextSpeedMps,
    lastUpdatedAt: Date.now(),
  };

  await notifySnapshotChanged();
}

export function getTrackerSnapshot() {
  return cloneSnapshot(trackerSession.currentSnapshot, {
    includeLiveElapsed: true,
  });
}

export async function hydrateTrackerFromStorage() {
  const stored = await readTrackingSession();

  if (!stored) {
    trackerSession.currentSnapshot = createIdleTrackingSnapshot();
    emitSnapshot();
    return;
  }

  trackerSession.currentSnapshot = {
    ...stored,
    speedMps: stored.isActive && !stored.isPaused ? stored.speedMps : 0,
  };

  scheduleElapsedTick();
  emitSnapshot();

  if (stored.isActive && !stored.isPaused && !stored.isFinished) {
    startWatchingPosition();
    await refreshNotification(stored);
  }
}

export function subscribeTracker(listener: TrackerListener) {
  trackerSession.listeners.add(listener);

  listener(
    cloneSnapshot(trackerSession.currentSnapshot, {
      includeLiveElapsed: true,
    }),
  );

  return () => {
    trackerSession.listeners.delete(listener);
  };
}