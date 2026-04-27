import AsyncStorage from '@react-native-async-storage/async-storage';
import {AVATAR_STORAGE_KEY, DEFAULT_AVATAR} from '../data/avatarOptions';
import type {AvatarConfig} from '../types';

export async function saveAvatarConfig(config: AvatarConfig) {
  await AsyncStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(config));
}

export async function loadAvatarConfig(): Promise<AvatarConfig> {
  const raw = await AsyncStorage.getItem(AVATAR_STORAGE_KEY);

  if (!raw) {
    return DEFAULT_AVATAR;
  }

  try {
    return {...DEFAULT_AVATAR, ...JSON.parse(raw)};
  } catch {
    return DEFAULT_AVATAR;
  }
}
