import {ensureNotificationChannels} from '../../services/notifications/channels';

let hasBootstrappedNotifications = false;

export async function bootstrapNotifications() {
  if (hasBootstrappedNotifications) {
    return;
  }

  await ensureNotificationChannels();
  hasBootstrappedNotifications = true;
}
