import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';

async function requestAndroidPermission(permission: PermissionsAndroid.Permission) {
  const granted = await PermissionsAndroid.request(permission);
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

async function ensureForegroundLocationPermission() {
  const fineGranted = await requestAndroidPermission(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (fineGranted) {
    return true;
  }

  const coarseGranted = await requestAndroidPermission(
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  );

  return coarseGranted;
}

async function ensureNotificationsPermission() {
  if (Platform.OS !== 'android' || Platform.Version < 33) {
    return true;
  }

  return requestAndroidPermission(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
}

export async function ensureTrackingPermissions() {
  if (Platform.OS === 'ios') {
    return true;
  }

  const locationGranted = await ensureForegroundLocationPermission();
  if (!locationGranted) {
    return false;
  }

  const notificationsGranted = await ensureNotificationsPermission();
  if (!notificationsGranted) {
    return false;
  }

  return true;
}

export async function ensureBackgroundTrackingPermission() {
  if (Platform.OS !== 'android' || Platform.Version < 29) {
    return true;
  }

  return requestAndroidPermission(
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  );
}

export function showLocationPermissionSettingsAlert() {
  Alert.alert(
    'Permiso de ubicación requerido',
    'GeoZone necesita acceso a la ubicación para registrar tu actividad. Actívalo en Ajustes.',
    [
      {text: 'Cancelar', style: 'cancel'},
      {
        text: 'Abrir Ajustes',
        onPress: () => {
          Linking.openSettings().catch(() => undefined);
        },
      },
    ],
  );
}

export function showDeviceLocationSettingsAlert() {
  Alert.alert(
    'Ubicación desactivada',
    'Activa el GPS del dispositivo para continuar con el seguimiento.',
    [
      {text: 'Cancelar', style: 'cancel'},
      {
        text: 'Abrir Ajustes',
        onPress: () => {
          Linking.openSettings().catch(() => undefined);
        },
      },
    ],
  );
}
