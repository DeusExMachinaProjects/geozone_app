import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AvatarConfig,
  AvatarBodyType,
  DEFAULT_AVATAR_CONFIG,
  defaultAvatarConfig,
} from '../types';

export const AVATAR_STORAGE_KEY = '@geozone/avatar-config';

function normalizeBodyType(value: unknown): AvatarBodyType {
  if (value === 'feminine' || value === 'female') {
    return 'feminine';
  }

  return 'masculine';
}

function normalizeString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0
    ? value
    : fallback;
}

function normalizeAvatarConfig(value: unknown): AvatarConfig {
  const candidate = value as Partial<
    AvatarConfig & {
      top?: string;
      bottom?: string;
      shoes?: string;
      shoe?: string;
    }
  > | null;

  if (!candidate || typeof candidate !== 'object') {
    return DEFAULT_AVATAR_CONFIG;
  }

  return {
    bodyType: normalizeBodyType(candidate.bodyType),
    skinTone: normalizeString(candidate.skinTone, DEFAULT_AVATAR_CONFIG.skinTone),
    hairStyle: normalizeString(
      candidate.hairStyle,
      DEFAULT_AVATAR_CONFIG.hairStyle,
    ),
    hairColor: normalizeString(
      candidate.hairColor,
      DEFAULT_AVATAR_CONFIG.hairColor,
    ),
    topStyle: normalizeString(
      candidate.topStyle ?? candidate.top,
      DEFAULT_AVATAR_CONFIG.topStyle,
    ),
    topColor: normalizeString(candidate.topColor, DEFAULT_AVATAR_CONFIG.topColor),
    bottomStyle: normalizeString(
      candidate.bottomStyle ?? candidate.bottom,
      DEFAULT_AVATAR_CONFIG.bottomStyle,
    ),
    bottomColor: normalizeString(
      candidate.bottomColor,
      DEFAULT_AVATAR_CONFIG.bottomColor,
    ),
    shoeStyle: normalizeString(
      candidate.shoeStyle ?? candidate.shoes ?? candidate.shoe,
      DEFAULT_AVATAR_CONFIG.shoeStyle,
    ),
    shoeColor: normalizeString(
      candidate.shoeColor,
      DEFAULT_AVATAR_CONFIG.shoeColor,
    ),
    accessory: normalizeString(
      candidate.accessory,
      DEFAULT_AVATAR_CONFIG.accessory,
    ),
    accessoryColor: normalizeString(
      candidate.accessoryColor,
      DEFAULT_AVATAR_CONFIG.accessoryColor,
    ),
  };
}

export async function loadAvatarConfig(): Promise<AvatarConfig> {
  try {
    const rawValue = await AsyncStorage.getItem(AVATAR_STORAGE_KEY);

    if (!rawValue) {
      return defaultAvatarConfig;
    }

    return normalizeAvatarConfig(JSON.parse(rawValue));
  } catch {
    return defaultAvatarConfig;
  }
}

export async function saveAvatarConfig(config: AvatarConfig): Promise<void> {
  const normalizedConfig = normalizeAvatarConfig(config);

  await AsyncStorage.setItem(
    AVATAR_STORAGE_KEY,
    JSON.stringify(normalizedConfig),
  );
}

export async function clearAvatarConfig(): Promise<void> {
  await AsyncStorage.removeItem(AVATAR_STORAGE_KEY);
}

export const getStoredAvatar = loadAvatarConfig;
export const saveStoredAvatar = saveAvatarConfig;