import BackgroundService from 'react-native-background-actions';
import type {ActivityType} from '../../features/tracking/types';

type TrackingBackgroundState = {
  activityType: ActivityType;
  elapsedMs: number;
  distanceMeters: number;
  speedMps: number;
  ascentMeters: number;
  isPaused: boolean;
};

const DEFAULT_DELAY_MS = 1000;

let currentState: TrackingBackgroundState = {
  activityType: 'run',
  elapsedMs: 0,
  distanceMeters: 0,
  speedMps: 0,
  ascentMeters: 0,
  isPaused: false,
};

let runnerStartedByTracking = false;

const sleep = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function formatElapsedTime(elapsedMs: number) {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return `${pad(minutes)}:${pad(seconds)}`;
}

function metersToDisplay(distanceMeters: number) {
  if (distanceMeters >= 1000) {
    return `${(distanceMeters / 1000).toFixed(2)} km`;
  }

  return `${Math.max(0, Math.round(distanceMeters))} m`;
}

function speedToKmh(speedMps: number) {
  return Math.max(0, speedMps * 3.6).toFixed(1);
}

function getActivityLabel(activityType: ActivityType) {
  switch (activityType) {
    case 'ride':
      return 'pedaleo';
    case 'pet':
      return 'mascota';
    case 'run':
    default:
      return 'carrera';
  }
}

function buildTaskTitle() {
  return 'GeoZone • actividad activa';
}

function buildTaskDesc(state: TrackingBackgroundState) {
  const status = state.isPaused ? 'Pausado' : 'Activo';

  return [
    `Estado ${status}`,
    `Distancia ${metersToDisplay(state.distanceMeters)}`,
    `Tiempo ${formatElapsedTime(state.elapsedMs)}`,
    `Velocidad ${speedToKmh(state.speedMps)} km/h`,
    `Ascenso ${Math.max(0, Math.round(state.ascentMeters))} m`,
  ].join(' · ');
}

function buildOptions(activityType: ActivityType) {
  return {
    taskName: 'GeoZoneTracking',
    taskTitle: buildTaskTitle(),
    taskDesc: `Iniciando ${getActivityLabel(activityType)}...`,
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#0F3D91',
    linkingURI: 'geozone://tracking',
    parameters: {
      delayMs: DEFAULT_DELAY_MS,
    },
  };
}

async function keepAliveTask(taskData?: {delayMs?: number}) {
  const delayMs = taskData?.delayMs ?? DEFAULT_DELAY_MS;

  while (BackgroundService.isRunning()) {
    try {
      await BackgroundService.updateNotification({
        taskTitle: buildTaskTitle(),
        taskDesc: buildTaskDesc(currentState),
      });
    } catch (error) {
      if (__DEV__) {
        console.warn('[backgroundRunner] updateNotification error', error);
      }
    }

    await sleep(delayMs);
  }
}

export async function startTrackingBackgroundRunner(activityType: ActivityType) {
  currentState = {
    ...currentState,
    activityType,
    elapsedMs: 0,
    distanceMeters: 0,
    speedMps: 0,
    ascentMeters: 0,
    isPaused: false,
  };

  if (BackgroundService.isRunning()) {
    runnerStartedByTracking = true;

    await BackgroundService.updateNotification({
      taskTitle: buildTaskTitle(),
      taskDesc: buildTaskDesc(currentState),
    });

    return;
  }

  runnerStartedByTracking = true;

  try {
    await BackgroundService.start(
      keepAliveTask,
      buildOptions(activityType),
    );
  } catch (error) {
    runnerStartedByTracking = false;

    if (__DEV__) {
      console.warn('[backgroundRunner] start error', error);
    }
  }
}

export async function updateTrackingBackgroundRunner(
  nextState: Partial<TrackingBackgroundState>,
) {
  currentState = {
    ...currentState,
    ...nextState,
  };

  if (!BackgroundService.isRunning()) {
    return;
  }

  try {
    await BackgroundService.updateNotification({
      taskTitle: buildTaskTitle(),
      taskDesc: buildTaskDesc(currentState),
    });
  } catch (error) {
    if (__DEV__) {
      console.warn('[backgroundRunner] update error', error);
    }
  }
}

export async function stopTrackingBackgroundRunner() {
  if (!BackgroundService.isRunning()) {
    runnerStartedByTracking = false;
    return;
  }

  try {
    await BackgroundService.stop();
  } catch (error) {
    if (__DEV__) {
      console.warn('[backgroundRunner] stop error', error);
    }
  } finally {
    runnerStartedByTracking = false;

    currentState = {
      activityType: 'run',
      elapsedMs: 0,
      distanceMeters: 0,
      speedMps: 0,
      ascentMeters: 0,
      isPaused: false,
    };
  }
}

export function isTrackingBackgroundRunnerActive() {
  return runnerStartedByTracking && BackgroundService.isRunning();
}