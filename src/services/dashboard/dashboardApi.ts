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

type DashboardApiResponse = {
  code: number;
  msgrsp: string;
  data?: DashboardMetasData;
};

export async function getDashboardMetas(): Promise<DashboardApiResponse> {
  const session = await loadAuthSession();

  if (!session?.accessToken) {
    return {
      code: 401,
      msgrsp: 'sesión no disponible',
    };
  }

  const response = await fetch(`${API_BASE_URL}/api/dashboard/metas`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  const rawText = await response.text();

  try {
    return JSON.parse(rawText) as DashboardApiResponse;
  } catch {
    return {
      code: 1,
      msgrsp: `Respuesta inválida del servidor (${response.status})`,
    };
  }
}