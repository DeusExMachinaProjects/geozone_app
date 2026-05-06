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

export type TrackingDetailRoutePoint = {
  secuencia?: number;
  latitude: number;
  longitude: number;
  timestamp?: number | null;
  speedMps?: number | null;
  speed?: number | null;
  altitudeMeters?: number | null;
  heading?: number | null;
};

export type TrackingDetailData = {
  idRun: number;
  idRuta: number;
  activityType: TrackingActivityType;
  activityLabel: string;
  startedAt: string;
  finishedAt: string;

  tipo?: string;
  inicio?: string;
  fin?: string;

  distanceMeters: number;
  durationSeconds: number;
  ascentMeters: number;
  calories: number;

  speedMinKmh: number;
  speedAvgKmh: number;
  speedMaxKmh: number;

  weather: {
    temperatureC: number | null;
    conditionLabel: string | null;
    humidityPercent: number | null;
    windSpeedKmh: number | null;
  };

  route: TrackingDetailRoutePoint[];
  summary?: unknown;
};

type ApiResponse = {
  code?: number;
  msgrsp?: string;
  message?: string;
  data?: unknown;
  [key: string]: unknown;
};

export type TrackingDetailResponse = {
  code: number;
  msgrsp: string;
  data?: TrackingDetailData;
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

async function getAuthHeaders() {
  const session = await loadAuthSession();

  if (!session?.accessToken) {
    throw new Error('No hay sesión activa.');
  }

  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.accessToken}`,
  };
}

export async function finishTrackingSession(payload: FinishTrackingPayload) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/tracking/finish`, {
    method: 'POST',
    headers,
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

export async function getTrackingDetail(
  idRun: number,
): Promise<TrackingDetailResponse> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/tracking/${idRun}`, {
    method: 'GET',
    headers,
  });

  const data = await parseJsonResponse(response);

  const apiCode = Number(data.code ?? 0);

  if (!response.ok || apiCode !== 0) {
    throw new Error(
      getErrorMessage(data, 'No se pudo cargar el detalle de la ruta.'),
    );
  }

  return data as TrackingDetailResponse;
}