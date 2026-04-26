import {API_BASE_URL as ENV_API_BASE_URL} from '@env';

const API_BASE_URL = (ENV_API_BASE_URL ?? '').trim();

if (!API_BASE_URL) {
  throw new Error(
    'API_BASE_URL no está definida. Revisa .env o .env.development en la raíz del proyecto.',
  );
}

export {API_BASE_URL};