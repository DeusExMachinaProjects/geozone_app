import BackgroundService from 'react-native-background-actions';
import type {
  ActivityType,
  TrackingSnapshot,
} from '../location/sessionStore';

const TRACKING_TASK_NAME = 'GeoZoneTrackingTask';
const TRACKING_TASK_TITLE = 'GeoZone · actividad activa';
const DEFAULT_DELAY_MS = 1000;

let latestSnapshot: TrackingSnapshot | null = null;
let latestActivityType: ActivityType = 'run';

type BackgroundTaskParams = {
  delayMs?: number;
};

function sleep(ms: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
}

function formatDistance(distanceMeters: number): string {
  const safeDistance = Number.isFinite(distanceMeters)
    ? Math.max(0, distanceMeters)
    : 0;

  if (safeDistance >= 1000) {
    return `${(safeDistance / 1000).toFixed(2)} km`;
  }

  return `${Math.round(safeDistance)} m`;
}

function formatSpeed(speedMps: number): string {
  const safeSpeed = Number.isFinite(speedMps) ? Math.max(0, speedMps) : 0;
  return `${(safeSpeed * 3.6).toFixed(1)} km/h`;
}

function formatElapsed(elapsedMs: number): string {
  const safeElapsed = Number.isFinite(elapsedMs) ? Math.max(0, elapsedMs) : 0;
  const totalSeconds = Math.floor(safeElapsed / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':');
}

function getActivityLabel(activityType: ActivityType): string {
  switch (activityType) {
    case 'ride':
      return 'bicicleta';
    case 'pet':
      return 'mascotas';
    case 'run':
    default:
      return 'actividad';
  }
}

function getLiveElapsedMs(snapshot: TrackingSnapshot): number {
  if (
    !snapshot.startedAt ||
    !snapshot.isActive ||
    snapshot.isPaused ||
    snapshot.isFinished
  ) {
    return snapshot.elapsedMs;
  }

  return snapshot.elapsedMs + Math.max(0, Date.now() - snapshot.startedAt);
}

function buildTaskTitle(activityType: ActivityType, isPaused?: boolean): string {
  const label = getActivityLabel(activityType);
  return isPaused
    ? `GeoZone · ${label} pausada`
    : `GeoZone · ${label} activa`;
}

function buildTaskDescription(snapshot?: TrackingSnapshot | null): string {
  if (!snapshot) {
    return 'Distancia 0 m · Tiempo 00:00:00 · Velocidad 0.0 km/h · Ascenso 0 m';
  }

  const elapsedMs = getLiveElapsedMs(snapshot);

  return [
    `Distancia ${formatDistance(snapshot.distanceMeters)}`,
    `Tiempo ${formatElapsed(elapsedMs)}`,
    `Velocidad ${formatSpeed(snapshot.speedMps)}`,
    `Ascenso ${Math.max(0, Math.round(snapshot.ascentMeters))} m`,
  ].join(' · ');
}

function buildBackgroundOptions(activityType: ActivityType) {
  return {
    taskName: TRACKING_TASK_NAME,
    taskTitle: buildTaskTitle(activityType, latestSnapshot?.isPaused),
    taskDesc: buildTaskDescription(latestSnapshot),
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#EF5A2A',
    linkingURI: 'geozone://tracking',
    parameters: {
      delayMs: DEFAULT_DELAY_MS,
    },
  };
}

async function updateNativeBackgroundNotification() {
  if (!BackgroundService.isRunning()) {
    return;
  }

  try {
    await BackgroundService.updateNotification({
      taskTitle: buildTaskTitle(
        latestSnapshot?.activityType ?? latestActivityType,
        latestSnapshot?.isPaused,
      ),
      taskDesc: buildTaskDescription(latestSnapshot),
    });
  } catch (error) {
    if (__DEV__) {
      console.warn('[backgroundRunner] updateNotification error', error);
    }
  }
}

const keepAliveTask = async (taskData?: BackgroundTaskParams) => {
  const delayMs = taskData?.delayMs ?? DEFAULT_DELAY_MS;

  while (BackgroundService.isRunning()) {
    await updateNativeBackgroundNotification();
    await sleep(delayMs);
  }
};

export async function startTrackingBackgroundRunner(
  activityType: ActivityType,
): Promise<void> {
  latestActivityType = activityType;

  if (BackgroundService.isRunning()) {
    await updateNativeBackgroundNotification();
    return;
  }

  try {
    await BackgroundService.start(
      keepAliveTask,
      buildBackgroundOptions(activityType),
    );
  } catch (error) {
    if (__DEV__) {
      console.warn('[backgroundRunner] start error', error);
    }
  }
}

export async function updateTrackingBackgroundRunner(
  snapshot: TrackingSnapshot,
): Promise<void> {
  latestSnapshot = snapshot;
  latestActivityType = snapshot.activityType;

  if (!snapshot.isActive || snapshot.isFinished) {
    await stopTrackingBackgroundRunner();
    return;
  }

  await updateNativeBackgroundNotification();
}

export async function stopTrackingBackgroundRunner(): Promise<void> {
  latestSnapshot = null;

  if (!BackgroundService.isRunning()) {
    return;
  }

  try {
    await BackgroundService.stop();
  } catch (error) {
    if (__DEV__) {
      console.warn('[backgroundRunner] stop error', error);
    }
  }
}

export function isTrackingBackgroundRunnerRunning(): boolean {
  return BackgroundService.isRunning();
}