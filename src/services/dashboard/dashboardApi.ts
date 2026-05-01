import {API_BASE_URL} from '@env';
import {loadAuthSession} from '../auth/authStorage';

export type DashboardMetasData = {
  user: {
    email: string;
    nombre: string;
    apellido: string;
    pesoKg: number | null;
    alturaCm: number | null;
    pesoObjetivoKg: number | null;
    imc: number | null;
  };
  weight: {
    initialWeightKg: number | null;
    currentWeightKg: number | null;
    targetWeightKg: number | null;
    weightLostKg: number;
    targetProgressPercent: number | null;
    history: Array<{
      pesoKg: number;
      origen: string;
      creadoEn: string;
    }>;
  };
  totals: {
    totalActivities: number;
    totalDistanceKm: number;
    totalDurationSeconds: number;
    totalAscentM: number;
    totalCalories: number;
    avgSpeedKmh: number;
    maxSpeedKmh: number;
  };
  byType: Array<{
    type: string;
    totalActivities: number;
    distanceKm: number;
    durationSeconds: number;
    calories: number;
  }>;
  recentActivities: Array<{
    idRun: number;
    idRuta: number;
    tipo: string;
    inicio: string;
    fin: string;
    distanceKm: number;
    durationSeconds: number;
    ascentM: number;
    calories: number;
    temperatureC: number | null;
    condition: string | null;
    avgSpeedKmh: number;
  }>;
};

export type DashboardRoutePoint = {
  secuencia?: number;
  latitude: number;
  longitude: number;
  timestamp: number | null;
  speedMps: number | null;
  altitudeMeters: number | null;
  heading: number | null;
};

export type TrackingDetailData = {
  idRun: number;
  idRuta: number;
  tipo: string;
  inicio: string;
  fin: string;
  distanceMeters: number;
  durationSeconds: number;
  ascentMeters: number;
  calories: number;
  speedMinKmh: number | null;
  speedAvgKmh: number | null;
  speedMaxKmh: number | null;
  weather: {
    temperatureC: number | null;
    conditionLabel: string | null;
    humidityPercent: number | null;
    windSpeedKmh: number | null;
  };
  route: DashboardRoutePoint[];
  summary: unknown | null;
};

type DashboardApiResponse = {
  code: number;
  msgrsp: string;
  data?: DashboardMetasData;
};

type TrackingDetailApiResponse = {
  code: number;
  msgrsp: string;
  data?: TrackingDetailData;
};

async function getAuthHeaders() {
  const session = await loadAuthSession();

  if (!session?.accessToken) {
    throw new Error('sesión no disponible');
  }

  return {
    Accept: 'application/json',
    Authorization: `Bearer ${session.accessToken}`,
  };
}

async function parseJson<T>(response: Response): Promise<T> {
  const rawText = await response.text();

  if (!rawText) {
    return {
      code: response.ok ? 0 : response.status,
      msgrsp: response.ok ? 'OK' : `Error del servidor (${response.status})`,
    } as T;
  }

  try {
    return JSON.parse(rawText) as T;
  } catch {
    return {
      code: 1,
      msgrsp: `Respuesta inválida del servidor (${response.status})`,
    } as T;
  }
}

export async function getDashboardMetas(): Promise<DashboardApiResponse> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/api/dashboard/metas`, {
      method: 'GET',
      headers,
    });

    return parseJson<DashboardApiResponse>(response);
  } catch (error) {
    return {
      code: 401,
      msgrsp:
        error instanceof Error ? error.message : 'No se pudo cargar dashboard.',
    };
  }
}

export async function getTrackingDetail(
  idRun: number,
): Promise<TrackingDetailApiResponse> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/api/tracking/${idRun}`, {
      method: 'GET',
      headers,
    });

    return parseJson<TrackingDetailApiResponse>(response);
  } catch (error) {
    return {
      code: 401,
      msgrsp:
        error instanceof Error
          ? error.message
          : 'No se pudo cargar la ruta.',
    };
  }
}