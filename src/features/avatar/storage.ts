import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ACCESSORY_TYPES,
  AVATAR_COLOR_KEYS,
  AvatarConfig,
  BODY_TYPES,
  BOTTOM_TYPES,
  DEFAULT_AVATAR_CONFIG,
  TOP_TYPES,
} from './types';

const AVATAR_STORAGE_KEY = '@geozone/avatar-config';

function pickEnumValue<T extends readonly string[]>(
  options: T,
  candidate: unknown,
  fallback: T[number],
): T[number] {
  if (typeof candidate === 'string' && options.includes(candidate as T[number])) {
    return candidate as T[number];
  }

  return fallback;
}

function sanitizeAvatarConfig(value: unknown): AvatarConfig {
  if (!value || typeof value !== 'object') {
    return DEFAULT_AVATAR_CONFIG;
  }

  const raw = value as Partial<AvatarConfig>;

  return {
    bodyType: pickEnumValue(
      BODY_TYPES,
      raw.bodyType,
      DEFAULT_AVATAR_CONFIG.bodyType,
    ),
    accessory: pickEnumValue(
      ACCESSORY_TYPES,
      raw.accessory,
      DEFAULT_AVATAR_CONFIG.accessory,
    ),
    top: pickEnumValue(TOP_TYPES, raw.top, DEFAULT_AVATAR_CONFIG.top),
    bottom: pickEnumValue(
      BOTTOM_TYPES,
      raw.bottom,
      DEFAULT_AVATAR_CONFIG.bottom,
    ),
    topColor: pickEnumValue(
      AVATAR_COLOR_KEYS,
      raw.topColor,
      DEFAULT_AVATAR_CONFIG.topColor,
    ),
    bottomColor: pickEnumValue(
      AVATAR_COLOR_KEYS,
      raw.bottomColor,
      DEFAULT_AVATAR_CONFIG.bottomColor,
    ),
    accessoryColor: pickEnumValue(
      AVATAR_COLOR_KEYS,
      raw.accessoryColor,
      DEFAULT_AVATAR_CONFIG.accessoryColor,
    ),
  };
}

export async function loadAvatarConfig(): Promise<AvatarConfig> {
  try {
    const saved = await AsyncStorage.getItem(AVATAR_STORAGE_KEY);

    if (!saved) {
      return DEFAULT_AVATAR_CONFIG;
    }

    const parsed = JSON.parse(saved);
    return sanitizeAvatarConfig(parsed);
  } catch (error) {
    console.warn('No se pudo cargar el avatar guardado:', error);
    return DEFAULT_AVATAR_CONFIG;
  }
}

export async function saveAvatarConfig(config: AvatarConfig): Promise<void> {
  try {
    await AsyncStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.warn('No se pudo guardar el avatar:', error);
    throw error;
  }
}