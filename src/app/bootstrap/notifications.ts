import {ensureNotificationChannels} from '../../services/notifications/channels';
import {registerTrackingForegroundService} from '../../services/notifications/foregroundService';

let hasBootstrappedNotifications = false;

export async function bootstrapNotifications() {
  if (hasBootstrappedNotifications) {
    return;
  }

  registerTrackingForegroundService();
  await ensureNotificationChannels();

  hasBootstrappedNotifications = true;
}