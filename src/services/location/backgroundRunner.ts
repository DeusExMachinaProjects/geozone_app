import BackgroundService from 'react-native-background-actions';

import type {ActivityType} from '../../features/tracking/types';
import {
  buildTrackingBackgroundOptions,
  buildTrackingBackgroundUpdate,
} from '../notifications/trackingNotification';

type BackgroundTrackingStatus =
  | 'starting'
  | 'active'
  | 'paused'
  | 'resumed'
  | 'stopped'
  | 'finished'
  | string;

type BackgroundTaskData = {
  delayMs?: number;
};

const DEFAULT_DELAY_MS = 15000;

const sleep = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });

const isActivityType = (value: unknown): value is ActivityType => {
  return value === 'run' || value === 'ride' || value === 'pet';
};

const getSafeActivityType = (value?: unknown): ActivityType => {
  return isActivityType(value) ? value : 'run';
};

const isRunnerActive = () => {
  try {
    return BackgroundService.isRunning();
  } catch {
    return false;
  }
};

/**
 * Esta tarea NO calcula GPS.
 * Solo mantiene vivo el Foreground Service de Android.
 *
 * El GPS debe arrancarse desde tracker.ts con startTracker().
 */
const keepAliveTask = async (taskData?: BackgroundTaskData) => {
  const delayMs =
    typeof taskData?.delayMs === 'number' && taskData.delayMs > 0
      ? taskData.delayMs
      : DEFAULT_DELAY_MS;

  while (isRunnerActive()) {
    await sleep(delayMs);
  }
};

const getStatusDescription = (
  status: BackgroundTrackingStatus,
  activityType: ActivityType,
) => {
  switch (status) {
    case 'starting':
      return 'Preparando seguimiento en segundo plano';

    case 'paused':
      return 'Seguimiento pausado';

    case 'resumed':
    case 'active':
      return 'Seguimiento activo en segundo plano';

    case 'stopped':
    case 'finished':
      return 'Seguimiento finalizado';

    default:
      return `Seguimiento activo · ${activityType}`;
  }
};

export async function startTrackingBackgroundRunner(
  activityType: ActivityType = 'run',
) {
  const safeActivityType = getSafeActivityType(activityType);
  const options = buildTrackingBackgroundOptions(safeActivityType);

  if (isRunnerActive()) {
    try {
      await BackgroundService.updateNotification(
        buildTrackingBackgroundUpdate(
          safeActivityType,
          'Seguimiento activo en segundo plano',
        ),
      );
    } catch (error) {
      if (__DEV__) {
        console.warn('[backgroundRunner] update while running error:', error);
      }
    }

    return;
  }

  try {
    /**
     * Algunas versiones de react-native-background-actions no tipan bien
     * foregroundServiceType, aunque Android sí lo necesita para location.
     */
    await BackgroundService.start(keepAliveTask, options as any);

    await BackgroundService.updateNotification(
      buildTrackingBackgroundUpdate(
        safeActivityType,
        'Seguimiento activo en segundo plano',
      ),
    );
  } catch (error) {
    if (__DEV__) {
      console.warn('[backgroundRunner] start error:', error);
    }
  }
}

/**
 * Compatible con ambas formas:
 *
 * 1) setTrackingBackgroundStatus(activityType, description)
 *    ejemplo: setTrackingBackgroundStatus('run', 'GPS activo')
 *
 * 2) setTrackingBackgroundStatus(status, activityType)
 *    ejemplo: setTrackingBackgroundStatus('paused', 'run')
 */
export async function setTrackingBackgroundStatus(
  firstArg: ActivityType | BackgroundTrackingStatus,
  secondArg?: string | ActivityType,
) {
  if (!isRunnerActive()) {
    return;
  }

  let activityType: ActivityType = 'run';
  let description = 'Seguimiento activo en segundo plano';

  if (isActivityType(firstArg)) {
    activityType = firstArg;

    description =
      typeof secondArg === 'string' && secondArg.trim().length > 0
        ? secondArg
        : 'Seguimiento activo en segundo plano';
  } else {
    activityType = getSafeActivityType(secondArg);
    description = getStatusDescription(firstArg, activityType);
  }

  try {
    await BackgroundService.updateNotification(
      buildTrackingBackgroundUpdate(activityType, description),
    );
  } catch (error) {
    if (__DEV__) {
      console.warn('[backgroundRunner] updateNotification error:', error);
    }
  }
}

export async function stopTrackingBackgroundRunner() {
  if (!isRunnerActive()) {
    return;
  }

  try {
    await BackgroundService.stop();
  } catch (error) {
    if (__DEV__) {
      console.warn('[backgroundRunner] stop error:', error);
    }
  }
}

export function isTrackingBackgroundRunnerRunning() {
  return isRunnerActive();
}