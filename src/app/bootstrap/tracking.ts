import {getNativeTrackingSnapshot} from '../../services/location';

let hasBootstrappedTracking = false;

export async function bootstrapTracking() {
  if (hasBootstrappedTracking) {
    return;
  }

  try {
    await getNativeTrackingSnapshot();
    hasBootstrappedTracking = true;
  } catch (error) {
    console.warn('No se pudo inicializar tracking', error);
  }
}