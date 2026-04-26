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

const keepAliveTask = async (taskData?: {delayMs?: number}) => {
  const delayMs = taskData?.delayMs ?? 15000;

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
    } catch {
      // No rompemos la app si falla la actualización.
    }
    return;
  }

  try {
    // Varias versiones del paquete no tipan foregroundServiceType,
    // pero Android sí lo soporta a nivel nativo.
    await BackgroundService.start(keepAliveTask, options as any);
  } catch (error) {
    if (__DEV__) {
      console.warn('[backgroundRunner] start error:', error);
    }
  }
}

/**
 * Compatible con ambas formas de uso:
 *
 * 1) setTrackingBackgroundStatus(activityType, description)
 * 2) setTrackingBackgroundStatus(status, activityType)
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