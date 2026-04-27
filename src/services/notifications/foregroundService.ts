import notifee from '@notifee/react-native';

let hasRegisteredForegroundService = false;

/**
 * Notifee exige registrar un foreground service antes de mostrar
 * una notificación con android.asForegroundService = true.
 *
 * El Promise queda vivo mientras dure el foreground service.
 */
export function registerTrackingForegroundService() {
  if (hasRegisteredForegroundService) {
    return;
  }

  notifee.registerForegroundService(() => {
    return new Promise(() => {
      // Mantiene vivo el foreground service hasta que Notifee lo detenga.
    });
  });

  hasRegisteredForegroundService = true;
}