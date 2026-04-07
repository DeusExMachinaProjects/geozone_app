import {NativeModules, PermissionsAndroid, Platform} from 'react-native';

export type BusinessNotificationCategory =
  | 'missions'
  | 'community'
  | 'system'
  | 'pets';

type BusinessNotificationsModuleShape = {
  send(
    title: string,
    body: string,
    category: BusinessNotificationCategory,
    notificationId: number,
  ): Promise<boolean>;
};

const BusinessNotifications =
  NativeModules.BusinessNotifications as BusinessNotificationsModuleShape | undefined;

function ensureModule() {
  if (Platform.OS !== 'android') {
    throw new Error('Las notificaciones de negocio quedaron implementadas primero para Android.');
  }

  if (!BusinessNotifications || typeof BusinessNotifications.send !== 'function') {
    throw new Error(
      'El módulo nativo BusinessNotifications no quedó registrado. Revisa MainApplication.kt y recompila.',
    );
  }

  return BusinessNotifications;
}

export async function ensureBusinessNotificationPermission() {
  if (Platform.OS !== 'android') {
    return true;
  }

  if (Platform.Version < 33) {
    return true;
  }

  const alreadyGranted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );

  if (alreadyGranted) {
    return true;
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    {
      title: 'Notificaciones de GeoZone',
      message: 'GeoZone necesita permiso para mostrar avisos de misiones, comunidad y mascotas.',
      buttonPositive: 'Aceptar',
      buttonNegative: 'Cancelar',
    },
  );

  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export async function sendBusinessNotification(params: {
  title: string;
  body: string;
  category?: BusinessNotificationCategory;
  notificationId?: number;
}) {
  const granted = await ensureBusinessNotificationPermission();

  if (!granted) {
    throw new Error('Permiso de notificaciones no concedido.');
  }

  const module = ensureModule();

  return module.send(
    params.title,
    params.body,
    params.category ?? 'system',
    params.notificationId ?? Date.now(),
  );
}