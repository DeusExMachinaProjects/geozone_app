import * as Keychain from 'react-native-keychain';
import type {AuthSession, LoginUser} from '../../features/auth/types/types';

const AUTH_SERVICE = 'geozone.auth';
const INSTALLATION_SERVICE = 'geozone.installation';

function generateInstallationId() {
  const a = Math.random().toString(36).slice(2);
  const b = Math.random().toString(36).slice(2);
  return `gz_${Date.now()}_${a}_${b}`;
}

export async function saveAuthSession(session: AuthSession) {
  await Keychain.setGenericPassword('session', JSON.stringify(session), {
    service: AUTH_SERVICE,
  });
}

export async function loadAuthSession(): Promise<AuthSession | null> {
  const credentials = await Keychain.getGenericPassword({
    service: AUTH_SERVICE,
  });

  if (!credentials) {
    return null;
  }

  try {
    return JSON.parse(credentials.password) as AuthSession;
  } catch {
    await clearAuthSession();
    return null;
  }
}

export async function clearAuthSession() {
  await Keychain.resetGenericPassword({
    service: AUTH_SERVICE,
  });
}

export async function updateStoredUser(user: LoginUser) {
  const current = await loadAuthSession();

  if (!current) {
    return;
  }

  await saveAuthSession({
    ...current,
    user,
  });
}

export async function getOrCreateInstallationId(): Promise<string> {
  const credentials = await Keychain.getGenericPassword({
    service: INSTALLATION_SERVICE,
  });

  if (credentials?.password) {
    return credentials.password;
  }

  const installationId = generateInstallationId();

  await Keychain.setGenericPassword('installation', installationId, {
    service: INSTALLATION_SERVICE,
  });

  return installationId;
}