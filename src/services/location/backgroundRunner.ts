import BackgroundService from 'react-native-background-actions';
import type {ActivityType} from '../../features/tracking/types';
import {
  buildTrackingBackgroundOptions,
  buildTrackingBackgroundUpdate,
} from '../notifications/trackingNotification';

const sleep = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });

const keepAliveTask = async (taskData?: {delayMs?: number}) => {
  const delayMs = taskData?.delayMs ?? 15000;

  while (BackgroundService.isRunning()) {
    await sleep(delayMs);
  }
};

export async function startTrackingBackgroundRunner(activityType: ActivityType) {
  if (BackgroundService.isRunning()) {
    await BackgroundService.stop();
  }

  const options = buildTrackingBackgroundOptions(activityType);
  await BackgroundService.start(keepAliveTask, options);
}

export async function updateTrackingBackgroundRunner(params: {
  activityType: ActivityType;
  distanceKm?: string;
  elapsedLabel?: string;
  speedKmh?: string;
}) {
  if (!BackgroundService.isRunning()) {
    return;
  }

  await BackgroundService.updateNotification(buildTrackingBackgroundUpdate(params));
}

export async function stopTrackingBackgroundRunner() {
  if (!BackgroundService.isRunning()) {
    return;
  }

  await BackgroundService.stop();
}
