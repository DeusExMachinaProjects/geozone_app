import Geolocation, {
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

const trackerSession: TrackerSession = {
  watchId: null,
  currentSnapshot: createIdleTrackingSnapshot(),
  listeners: new Set(),
  elapsedTimer: null,
  lastPersistedAt: 0,
};

const WATCH_OPTIONS: GeoWatchOptions = {
  enableHighAccuracy: true,
  distanceFilter: 5,
  interval: 4000,
  fastestInterval: 2000,
  forceRequestLocation: true,
  showLocationDialog: true,
};

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

function cloneSnapshot(snapshot: TrackingSnapshot): TrackingSnapshot {
  return {
    ...snapshot,
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

function getElapsedMs(snapshot: TrackingSnapshot, now = Date.now()) {
  if (!snapshot.startedAt) {
    return snapshot.elapsedMs;
  }

  if (!snapshot.isActive || snapshot.isPaused || snapshot.isFinished) {
    return snapshot.elapsedMs;
  }

  return snapshot.elapsedMs + Math.max(0, now - snapshot.startedAt);
}

function calculateSpeedMps(distanceMeters: number, elapsedMs: number) {
  if (elapsedMs <= 0) {
    return 0;
  }

  return distanceMeters / (elapsedMs / 1000);
}

async function persistSnapshot(force = false) {
  const now = Date.now();

  if (!force && now - trackerSession.lastPersistedAt < 1200) {
    return;
  }

  const snapshotToPersist = cloneSnapshot(trackerSession.currentSnapshot);

  await writeTrackingSession(snapshotToPersist);
  trackerSession.lastPersistedAt = now;
}

async function refreshNotification(snapshot: TrackingSnapshot) {
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
}

function emitSnapshot() {
  const cloned = cloneSnapshot(trackerSession.currentSnapshot);

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
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    timestamp: position.timestamp ?? Date.now(),
    accuracy: position.coords.accuracy,
    altitude:
      typeof position.coords.altitude === 'number'
        ? position.coords.altitude
        : null,
    altitudeAccuracy:
      typeof position.coords.altitudeAccuracy === 'number'
        ? position.coords.altitudeAccuracy
        : null,
    heading:
      typeof position.coords.heading === 'number'
        ? position.coords.heading
        : null,
    speed:
      typeof position.coords.speed === 'number' ? position.coords.speed : null,
  };
}

function shouldUsePoint(point: TrackingPoint) {
  if (
    typeof point.accuracy === 'number' &&
    Number.isFinite(point.accuracy) &&
    point.accuracy > 100
  ) {
    return false;
  }

  return true;
}

  return true;
}

function updateAscent(previousPoint: TrackingPoint | null, nextPoint: TrackingPoint) {
  if (!previousPoint) {
    return trackerSession.currentSnapshot.ascentMeters;
  }

  const previousAltitude =
    typeof previousPoint.altitude === 'number' ? previousPoint.altitude : null;
  const nextAltitude =
    typeof nextPoint.altitude === 'number' ? nextPoint.altitude : null;

  if (previousAltitude === null || nextAltitude === null) {
    return trackerSession.currentSnapshot.ascentMeters;
  }

  const delta = nextAltitude - previousAltitude;

  if (delta > 0) {
    return trackerSession.currentSnapshot.ascentMeters + delta;
  }

  return trackerSession.currentSnapshot.ascentMeters;
}

function stopWatchingPosition() {
  if (trackerSession.watchId !== null) {
    Geolocation.clearWatch(trackerSession.watchId);
    trackerSession.watchId = null;
  }

  Geolocation.stopObserving();
}

function handleWatchError() {
  // dejamos el tracker vivo, solo sin última posición válida nueva
}

function startWatchingPosition() {
  stopWatchingPosition();

  trackerSession.watchId = Geolocation.watchPosition(
    position => {
      void upsertPosition(position);
    },
    error => {
      handleWatchError();
      console.warn('[tracker] watchPosition error', error);
    },
    WATCH_OPTIONS,
  );
}

export async function startTracker(activityType: ActivityType) {
  const previous = trackerSession.currentSnapshot;
  const now = Date.now();

  trackerSession.currentSnapshot = {
    ...createIdleTrackingSnapshot(activityType),
    isActive: true,
    isPaused: false,
    isFinished: false,
    startedAt: now,
    activityType,
    route: previous.isFinished ? [] : previous.route,
    lastPoint: previous.isFinished ? null : previous.lastPoint,
    distanceMeters: previous.isFinished ? 0 : previous.distanceMeters,
    speedMps: 0,
    ascentMeters: previous.isFinished ? 0 : previous.ascentMeters,
    elapsedMs: previous.isFinished ? 0 : previous.elapsedMs,
    lastUpdatedAt: now,
  };

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
    startedAt: Date.now(),
    lastUpdatedAt: Date.now(),
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
    elapsedMs: getElapsedMs(snapshot),
    startedAt: null,
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

  if (!shouldUsePoint(point, snapshot.lastPoint)) {
    return;
  }

  const previousPoint = snapshot.lastPoint;
  let nextDistance = snapshot.distanceMeters;
  let nextAscent = snapshot.ascentMeters;

  if (previousPoint) {
    const segmentDistance = calculateDistanceMeters(previousPoint, point);

    if (segmentDistance >= 1.5) {
      nextDistance += segmentDistance;
    }

    nextAscent = updateAscent(previousPoint, point);
  }

  const nextElapsedMs = getElapsedMs(snapshot);
  const nextRoute =
    !previousPoint || calculateDistanceMeters(previousPoint, point) >= 1.5
      ? [...snapshot.route, point]
      : snapshot.route;

  trackerSession.currentSnapshot = {
    ...snapshot,

    route: nextRoute,

    lastPoint: point,
    location: point,
    hasLocation: true,
    altitudeMeters: typeof point.altitude === 'number' ? point.altitude : null,
    errorCode: null,

    distanceMeters: nextDistance,
    ascentMeters: nextAscent,
    elapsedMs: nextElapsedMs,
    speedMps: calculateSpeedMps(nextDistance, nextElapsedMs),

    lastUpdatedAt: Date.now(),
  };

  await notifySnapshotChanged();
}

export function getTrackerSnapshot() {
  scheduleElapsedTick();
  return cloneSnapshot(trackerSession.currentSnapshot);
}

export async function hydrateTrackerFromStorage() {
  const stored = await readTrackingSession();

  if (!stored) {
    trackerSession.currentSnapshot = createIdleTrackingSnapshot();
    emitSnapshot();
    return;
  }

  trackerSession.currentSnapshot = stored;
  scheduleElapsedTick();
  emitSnapshot();

  if (stored.isActive && !stored.isPaused && !stored.isFinished) {
    startWatchingPosition();
    await refreshNotification(stored);
  }
}

export function subscribeTracker(listener: TrackerListener) {
  trackerSession.listeners.add(listener);
  listener(cloneSnapshot(trackerSession.currentSnapshot));

  return () => {
    trackerSession.listeners.delete(listener);
  };
}