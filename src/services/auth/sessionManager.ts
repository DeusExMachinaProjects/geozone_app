import type {
  AuthApiResponse,
  AuthSession,
  LoginUser,
} from '../../features/auth/types/types';
import {
  clearAuthSession,
  loadAuthSession,
  saveAuthSession,
  updateStoredUser,
} from './authStorage';
import {
  getMeRequest,
  logoutRequest,
  refreshTokenRequest,
} from './authApi';

const EXPIRY_SKEW_MS = 30 * 1000;

function isFutureDate(value?: string | null) {
  if (!value) {
    return false;
  }

  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return false;
  }

  return timestamp > Date.now() + EXPIRY_SKEW_MS;
}

function getUserFromResponse(
  data: AuthApiResponse,
  fallbackUser?: LoginUser,
): LoginUser | null {
  return data.usuario ?? data.usuarios?.[0] ?? fallbackUser ?? null;
}

export function mapAuthResponseToSession(
  data: AuthApiResponse,
  fallbackUser?: LoginUser,
): AuthSession {
  const user = getUserFromResponse(data, fallbackUser);
  const accessToken = data.accessToken ?? data.token;

  if (
    !user ||
    !accessToken ||
    !data.accessTokenExpiresAt ||
    !data.refreshToken ||
    !data.refreshTokenExpiresAt
  ) {
    throw new Error('La respuesta de autenticación está incompleta.');
  }

  return {
    accessToken,
    accessTokenExpiresAt: data.accessTokenExpiresAt,
    refreshToken: data.refreshToken,
    refreshTokenExpiresAt: data.refreshTokenExpiresAt,
    sessionId: data.sessionId,
    user,
  };
}

async function hydrateUserWithMe(session: AuthSession): Promise<AuthSession> {
  try {
    const meResponse = await getMeRequest(session.accessToken);
    const user = getUserFromResponse(meResponse, session.user);

    if (!user || meResponse.code !== 0) {
      return session;
    }

    const nextSession = {
      ...session,
      user,
    };

    await updateStoredUser(user);
    return nextSession;
  } catch {
    return session;
  }
}

export async function bootstrapStoredSession(): Promise<AuthSession | null> {
  const stored = await loadAuthSession();

  if (!stored) {
    return null;
  }

  if (isFutureDate(stored.accessTokenExpiresAt)) {
    const hydrated = await hydrateUserWithMe(stored);
    await saveAuthSession(hydrated);
    return hydrated;
  }

  if (!isFutureDate(stored.refreshTokenExpiresAt)) {
    await clearAuthSession();
    return null;
  }

  try {
    const refreshResponse = await refreshTokenRequest({
      refreshToken: stored.refreshToken,
    });

    if (refreshResponse.code !== 0) {
      await clearAuthSession();
      return null;
    }

    const nextSession = mapAuthResponseToSession(refreshResponse, stored.user);
    const hydrated = await hydrateUserWithMe(nextSession);

    await saveAuthSession(hydrated);
    return hydrated;
  } catch {
    await clearAuthSession();
    return null;
  }
}

export async function refreshStoredSession(): Promise<AuthSession | null> {
  const stored = await loadAuthSession();

  if (!stored) {
    return null;
  }

  if (!isFutureDate(stored.refreshTokenExpiresAt)) {
    await clearAuthSession();
    return null;
  }

  try {
    const refreshResponse = await refreshTokenRequest({
      refreshToken: stored.refreshToken,
    });

    if (refreshResponse.code !== 0) {
      await clearAuthSession();
      return null;
    }

    const nextSession = mapAuthResponseToSession(refreshResponse, stored.user);
    const hydrated = await hydrateUserWithMe(nextSession);

    await saveAuthSession(hydrated);
    return hydrated;
  } catch {
    await clearAuthSession();
    return null;
  }
}

export async function getValidAccessToken(): Promise<string | null> {
  const stored = await loadAuthSession();

  if (!stored) {
    return null;
  }

  if (isFutureDate(stored.accessTokenExpiresAt)) {
    return stored.accessToken;
  }

  const refreshed = await refreshStoredSession();
  return refreshed?.accessToken ?? null;
}

export async function remoteLogoutCurrentSession() {
  const stored = await loadAuthSession();

  try {
    if (stored?.refreshToken) {
      await logoutRequest({refreshToken: stored.refreshToken});
    }
  } catch {
    // no bloqueamos el logout local si el backend falla
  } finally {
    await clearAuthSession();
  }
}