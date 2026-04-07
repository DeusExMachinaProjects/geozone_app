import {Linking, NativeModules, Platform} from 'react-native';
import type {ActivityType, TrackingPoint} from '../../features/tracking/types';

export type NativeTrackingSnapshot = {
  isActive: boolean;
  isPaused: boolean;
  isFinished: boolean;
  activityType: ActivityType;
  elapsedMs: number;
  distanceMeters: number;
  speedMps: number;
  hasLocation: boolean;
  errorCode?: string | null;
  location: TrackingPoint | null;
  route: TrackingPoint[];
};

type TrackingForegroundModuleShape = {
  startTracking(activityType: ActivityType): Promise<boolean>;
  pauseTracking(): Promise<boolean>;
  resumeTracking(): Promise<boolean>;
  stopTracking(): Promise<boolean>;
  getTrackingSnapshot(): Promise<NativeTrackingSnapshot>;
  openLocationSettings(): Promise<boolean>;
};

const TrackingForeground = NativeModules.TrackingForeground as
  | TrackingForegroundModuleShape
  | undefined;

function ensureAndroidModule() {
  if (Platform.OS !== 'android') {
    throw new Error('El tracking nativo quedó implementado solo para Android.');
  }

  if (!TrackingForeground) {
    throw new Error(
      'El módulo nativo TrackingForeground no quedó registrado. Revisa MainApplication.kt y TrackingForegroundPackage.kt, luego recompila la APK.',
    );
  }

  if (typeof TrackingForeground.startTracking !== 'function') {
    throw new Error(
      'TrackingForeground existe, pero startTracking no está disponible.',
    );
  }

  return TrackingForeground;
}

export async function startNativeTracking(activityType: ActivityType) {
  return ensureAndroidModule().startTracking(activityType);
}

export async function pauseNativeTracking() {
  return ensureAndroidModule().pauseTracking();
}

export async function resumeNativeTracking() {
  return ensureAndroidModule().resumeTracking();
}

export async function stopNativeTracking() {
  return ensureAndroidModule().stopTracking();
}

export async function getNativeTrackingSnapshot() {
  return ensureAndroidModule().getTrackingSnapshot();
}

export async function openNativeLocationSettings() {
  if (Platform.OS === 'android' && TrackingForeground) {
    return TrackingForeground.openLocationSettings();
  }

  return Linking.openSettings();
}