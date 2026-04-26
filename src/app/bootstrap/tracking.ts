import {hydrateTrackerFromStorage} from '../../services/location/tracker';

let hasBootstrappedTracking = false;

export async function bootstrapTracking() {
  if (hasBootstrappedTracking) {
    return;
  }

  try {
    await hydrateTrackerFromStorage();
    hasBootstrappedTracking = true;
  } catch (error) {
    console.warn('No se pudo inicializar tracking', error);
  }
}