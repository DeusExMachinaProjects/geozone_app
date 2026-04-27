import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AvatarConfig,
  DEFAULT_AVATAR_CONFIG,
  defaultAvatarConfig,
} from '../types';

export const AVATAR_STORAGE_KEY = '@geozone/avatar-config';

function normalizeAvatarConfig(value: unknown): AvatarConfig {
  const candidate = value as Partial<AvatarConfig> | null;

  return {
    ...DEFAULT_AVATAR_CONFIG,
    ...(candidate ?? {}),
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

// Compatibilidad con nombres antiguos, por si algún componente viejo los usa.
export const getStoredAvatar = loadAvatarConfig;
export const saveStoredAvatar = saveAvatarConfig;