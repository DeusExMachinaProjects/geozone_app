import {Platform} from 'react-native';

import {API_BASE_URL} from '@env';
import type {
  AuthApiResponse,
  PushTokenPayload,
  RegisterPayload,
} from '../../features/auth/types/types';

import {getOrCreateInstallationId} from './authStorage';

function getApiPlatform() {
  return Platform.OS === 'ios' ? 'ios' : 'android';
}

async function parseJsonResponse(response: Response): Promise<AuthApiResponse> {
  const rawText = await response.text();

  let data: AuthApiResponse | null = null;

  try {
    data = rawText ? (JSON.parse(rawText) as AuthApiResponse) : null;
  } catch {
    data = null;
  }

  if (!data) {
    return {
      code: 1,
      msgrsp: `Respuesta inválida del servidor (${response.status})`,
    };
  }

  return data;
}

async function postJson(
  path: string,
  body: Record<string, unknown>,
  accessToken?: string,
): Promise<AuthApiResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(accessToken ? {Authorization: `Bearer ${accessToken}`} : {}),
    },
    body: JSON.stringify(body),
  });

  return parseJsonResponse(response);
}

async function getJson(
  path: string,
  accessToken: string,
): Promise<AuthApiResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return parseJsonResponse(response);
}

export async function loginRequest(params: {
  email: string;
  password: string;
}): Promise<AuthApiResponse> {
  const deviceId = await getOrCreateInstallationId();

  return postJson('/api/users/login', {
    email: params.email,
    password: params.password,
    deviceId,
    platform: getApiPlatform(),
  });
}

export async function registerRequest(
  payload: RegisterPayload,
): Promise<AuthApiResponse> {
  const deviceId = await getOrCreateInstallationId();

  return postJson('/api/users/register', {
    email: payload.email,
    password: payload.password,
    nombre: payload.nombre,
    apellido: payload.apellido,
    fecNacimiento: payload.fecNacimiento,
    genero: payload.genero,
    nick: payload.nick,
    subscrito: payload.subscrito ?? false,

    /**
     * Nuevos datos físicos para métricas.
     * Mantengo nombres camelCase para que sean consistentes con tu API actual.
     * En backend puedes mapearlos a PESO_KG, ALTURA_CM y PESO_OBJETIVO_KG.
     */
    pesoKg: payload.pesoKg,
    alturaCm: payload.alturaCm,
    pesoObjetivoKg: payload.pesoObjetivoKg ?? null,

    deviceId,
    platform: getApiPlatform(),
  });
}

export async function refreshTokenRequest(params: {
  refreshToken: string;
}): Promise<AuthApiResponse> {
  const deviceId = await getOrCreateInstallationId();

  return postJson('/api/users/refresh', {
    refreshToken: params.refreshToken,
    deviceId,
    platform: getApiPlatform(),
  });
}

export async function logoutRequest(params: {
  refreshToken: string;
}): Promise<AuthApiResponse> {
  const deviceId = await getOrCreateInstallationId();

  return postJson('/api/users/logout', {
    refreshToken: params.refreshToken,
    deviceId,
  });
}

export async function getMeRequest(
  accessToken: string,
): Promise<AuthApiResponse> {
  return getJson('/api/users/me', accessToken);
}

export async function savePushTokenRequest(
  accessToken: string,
  payload: PushTokenPayload,
): Promise<AuthApiResponse> {
  const deviceId = await getOrCreateInstallationId();

  return postJson(
    '/api/users/push-token',
    {
      deviceId,
      platform: getApiPlatform(),
      pushToken: payload.pushToken,
    },
    accessToken,
  );
}