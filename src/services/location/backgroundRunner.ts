import BackgroundService from 'react-native-background-actions';

export type ActivityType = 'run' | 'ride' | 'pet';

export type BackgroundTrackingSnapshot = {
  activityType?: ActivityType;
  elapsedMs?: number;
  distanceMeters?: number;
  speedMps?: number;
  ascentMeters?: number;
  isActive?: boolean;
  isPaused?: boolean;
  isFinished?: boolean;
};

const DEFAULT_DELAY_MS = 15000;

let lastSnapshot: BackgroundTrackingSnapshot | null = null;

const sleep = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });

const formatElapsed = (elapsedMs = 0) => {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = `${hours}`.padStart(2, '0');
  const mm = `${minutes}`.padStart(2, '0');
  const ss = `${seconds}`.padStart(2, '0');

  return `${hh}:${mm}:${ss}`;
};

const getActivityLabel = (activityType?: ActivityType) => {
  switch (activityType) {
    case 'ride':
      return 'ciclismo';
    case 'pet':
      return 'paseo pet';
    case 'run':
    default:
      return 'actividad';
  }
};

const buildNotificationDescription = (snapshot?: BackgroundTrackingSnapshot | null) => {
  const distanceMeters = Math.max(0, Math.round(snapshot?.distanceMeters ?? 0));
  const elapsed = formatElapsed(snapshot?.elapsedMs ?? 0);
  const speedKmh = Math.max(0, (snapshot?.speedMps ?? 0) * 3.6).toFixed(1);
  const ascentMeters = Math.max(0, Math.round(snapshot?.ascentMeters ?? 0));

  return `Distancia ${distanceMeters} m · Tiempo ${elapsed} · Velocidad ${speedKmh} km/h · Ascenso ${ascentMeters} m`;
};

const buildBackgroundOptions = (snapshot?: BackgroundTrackingSnapshot | null) => {
  const activityLabel = getActivityLabel(snapshot?.activityType);

  return {
    taskName: 'GeoZoneTracking',
    taskTitle: 'GeoZone · actividad activa',
    taskDesc: buildNotificationDescription(snapshot),
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#173B8F',
    linkingURI: 'geozone://tracking',
    parameters: {
      delayMs: DEFAULT_DELAY_MS,
    },
    progressBar: {
      max: 100,
      value: 0,
      indeterminate: true,
    },
    taskProgressTitle: `GeoZone · ${activityLabel} en curso`,
    taskProgressDesc: buildNotificationDescription(snapshot),
  };
};

const keepAliveTask = async (taskData?: {delayMs?: number}) => {
  const delayMs = taskData?.delayMs ?? DEFAULT_DELAY_MS;

  while (BackgroundService.isRunning()) {
    await sleep(delayMs);
  }
};

export async function startTrackingBackgroundRunner(
  activityType: ActivityType,
  snapshot?: BackgroundTrackingSnapshot,
) {
  lastSnapshot = {
    ...snapshot,
    activityType,
    isActive: true,
    isPaused: false,
    isFinished: false,
  };

  const options = buildBackgroundOptions(lastSnapshot);

  try {
    if (BackgroundService.isRunning()) {
      await BackgroundService.updateNotification({
        taskTitle: options.taskTitle,
        taskDesc: options.taskDesc,
      });
      return;
    }

    await BackgroundService.start(keepAliveTask, options);
  } catch (error) {
    console.warn('[GeoZone][backgroundRunner] No se pudo iniciar el runner:', error);
  }
}

export async function updateTrackingBackgroundRunner(
  snapshot: BackgroundTrackingSnapshot,
) {
  lastSnapshot = {
    ...lastSnapshot,
    ...snapshot,
  };

  try {
    if (!BackgroundService.isRunning()) {
      return;
    }

    await BackgroundService.updateNotification({
      taskTitle: 'GeoZone · actividad activa',
      taskDesc: buildNotificationDescription(lastSnapshot),
    });
  } catch (error) {
    console.warn('[GeoZone][backgroundRunner] No se pudo actualizar la notificación:', error);
  }
}

export async function stopTrackingBackgroundRunner() {
  lastSnapshot = null;

  try {
    if (BackgroundService.isRunning()) {
      await BackgroundService.stop();
    }
  } catch (error) {
    console.warn('[GeoZone][backgroundRunner] No se pudo detener el runner:', error);
  }
}

export function getLastTrackingBackgroundSnapshot() {
  return lastSnapshot;
}