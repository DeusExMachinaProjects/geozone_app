import {API_BASE_URL} from '@env';
import {loadAuthSession} from '../auth/authStorage';

export type TrackingActivityType = 'run' | 'ride' | 'pet';

export type TrackingRoutePointPayload = {
  secuencia: number;
  latitude: number;
  longitude: number;
  timestamp: number | null;
  speedMps: number | null;
  altitudeMeters: number | null;
  heading: number | null;
};

export type FinishTrackingPayload = {
  activityType: TrackingActivityType;
  startedAt: string;
  finishedAt: string;
  distanceMeters: number;
  durationMs: number;
  ascentMeters: number;
  velocidadMinKmh: number;
  velocidadPromKmh: number;
  velocidadMaxKmh: number;
  temperatureC: number | null;
  apparentTemperatureC: number | null;
  humidityPercent: number | null;
  windSpeedKmh: number | null;
  precipitationMm: number | null;
  weatherCode: number | null;
  weatherCondition: string | null;
  weatherConditionLabel: string | null;
  route: TrackingRoutePointPayload[];
};

type ApiResponse = {
  code?: number;
  msgrsp?: string;
  message?: string;
  [key: string]: unknown;
};

async function parseJsonResponse(response: Response): Promise<ApiResponse> {
  const rawText = await response.text();

  if (!rawText) {
    return {
      code: response.ok ? 0 : 1,
      msgrsp: response.ok ? 'OK' : `Error del servidor (${response.status})`,
    };
  }

  try {
    return JSON.parse(rawText) as ApiResponse;
  } catch {
    return {
      code: 1,
      msgrsp: `Respuesta inválida del servidor (${response.status})`,
    };
  }
}

function getErrorMessage(data: ApiResponse, fallback: string) {
  return data.msgrsp || data.message || fallback;
}

export async function finishTrackingSession(payload: FinishTrackingPayload) {
  const session = await loadAuthSession();

  if (!session?.accessToken) {
    throw new Error('No hay sesión activa para guardar la actividad.');
  }

  const response = await fetch(`${API_BASE_URL}/api/tracking/finish`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJsonResponse(response);

  const apiCode = Number(data.code ?? 0);

  if (!response.ok || (apiCode !== 0 && apiCode !== 200)) {
    throw new Error(
      getErrorMessage(data, 'No se pudo guardar la actividad en el servidor.'),
    );
  }

  return data;
}
