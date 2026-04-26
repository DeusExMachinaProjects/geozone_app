import {API_BASE_URL} from '@env';
import {
  getValidAccessToken,
  refreshStoredSession,
  remoteLogoutCurrentSession,
} from './sessionManager';

function buildHeaders(init: RequestInit, accessToken: string) {
  const headers = new Headers(init.headers || {});

  headers.set('Accept', 'application/json');
  headers.set('Authorization', `Bearer ${accessToken}`);

  const isFormData =
    typeof FormData !== 'undefined' && init.body instanceof FormData;

  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return headers;
}

async function doRequest(
  path: string,
  init: RequestInit,
  accessToken: string,
) {
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: buildHeaders(init, accessToken),
  });
}

export async function authenticatedFetch(
  path: string,
  init: RequestInit = {},
) {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    await remoteLogoutCurrentSession();
    throw new Error('Sesión expirada');
  }

  let response = await doRequest(path, init, accessToken);

  if (response.status !== 401) {
    return response;
  }

  const refreshed = await refreshStoredSession();

  if (!refreshed?.accessToken) {
    await remoteLogoutCurrentSession();
    throw new Error('Sesión inválida o expirada');
  }

  response = await doRequest(path, init, refreshed.accessToken);

  if (response.status === 401) {
    await remoteLogoutCurrentSession();
    throw new Error('Sesión inválida o expirada');
  }

  return response;
}