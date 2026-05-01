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

export type FinishTrackingResponse = {
  code?: number;
  msgrsp?: string;
  message?: string;
  idRun?: number;
  idRuta?: number;
  [key: string]: unknown;
};

async function parseJsonResponse(
  response: Response,
): Promise<FinishTrackingResponse> {
  const rawText = await response.text();

  if (!rawText) {
    return {
      code: response.ok ? 0 : 1,
      msgrsp: response.ok ? 'OK' : `Error del servidor (${response.status})`,
    };
  }

  try {
    return JSON.parse(rawText) as FinishTrackingResponse;
  } catch {
    return {
      code: 1,
      msgrsp: `Respuesta inválida del servidor (${response.status})`,
    };
  }
}

function getErrorMessage(data: FinishTrackingResponse, fallback: string) {
  return data.msgrsp || data.message || fallback;
}

function toFiniteNumber(value: unknown, fallback = 0) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return fallback;
  }

  return numberValue;
}

function normalizeRoute(route: TrackingRoutePointPayload[]) {
  return route
    .filter(point => {
      return (
        Number.isFinite(Number(point.latitude)) &&
        Number.isFinite(Number(point.longitude))
      );
    })
    .map((point, index) => ({
      secuencia: Number.isFinite(Number(point.secuencia))
        ? Number(point.secuencia)
        : index + 1,
      latitude: Number(point.latitude),
      longitude: Number(point.longitude),
      timestamp:
        point.timestamp === null || point.timestamp === undefined
          ? null
          : toFiniteNumber(point.timestamp, Date.now()),
      speedMps:
        point.speedMps === null || point.speedMps === undefined
          ? null
          : toFiniteNumber(point.speedMps, 0),
      altitudeMeters:
        point.altitudeMeters === null || point.altitudeMeters === undefined
          ? null
          : toFiniteNumber(point.altitudeMeters, 0),
      heading:
        point.heading === null || point.heading === undefined
          ? null
          : toFiniteNumber(point.heading, 0),
    }));
}

function normalizeNullableNumber(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : null;
}

function normalizePayload(payload: FinishTrackingPayload): FinishTrackingPayload {
  return {
    activityType: payload.activityType,
    startedAt: payload.startedAt,
    finishedAt: payload.finishedAt,

    distanceMeters: toFiniteNumber(payload.distanceMeters, 0),
    durationMs: toFiniteNumber(payload.durationMs, 0),
    ascentMeters: toFiniteNumber(payload.ascentMeters, 0),

    velocidadMinKmh: toFiniteNumber(payload.velocidadMinKmh, 0),
    velocidadPromKmh: toFiniteNumber(payload.velocidadPromKmh, 0),
    velocidadMaxKmh: toFiniteNumber(payload.velocidadMaxKmh, 0),

    temperatureC: normalizeNullableNumber(payload.temperatureC),
    apparentTemperatureC: normalizeNullableNumber(payload.apparentTemperatureC),
    humidityPercent: normalizeNullableNumber(payload.humidityPercent),
    windSpeedKmh: normalizeNullableNumber(payload.windSpeedKmh),
    precipitationMm: normalizeNullableNumber(payload.precipitationMm),
    weatherCode: normalizeNullableNumber(payload.weatherCode),

    weatherCondition: payload.weatherCondition ?? null,
    weatherConditionLabel: payload.weatherConditionLabel ?? null,

    route: normalizeRoute(payload.route ?? []),
  };
}

export async function finishTrackingSession(payload: FinishTrackingPayload) {
  const session = await loadAuthSession();

  if (!session?.accessToken) {
    throw new Error('No hay sesión activa para guardar la actividad.');
  }

  const cleanPayload = normalizePayload(payload);

  const response = await fetch(`${API_BASE_URL}/api/tracking/finish`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(cleanPayload),
  });

  const data = await parseJsonResponse(response);
  const apiCode = Number(data.code ?? 0);

  if (!response.ok || (apiCode !== 0 && apiCode !== 200 && apiCode !== 201)) {
    throw new Error(
      getErrorMessage(data, 'No se pudo guardar la actividad en el servidor.'),
    );
  }

  return data;
}