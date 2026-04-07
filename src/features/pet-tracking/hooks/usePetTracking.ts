import {useMemo} from 'react';
import {useActivityTracking} from '../../tracking/hooks/useActivityTracking';

export function usePetTracking() {
  const tracking = useActivityTracking({activityType: 'pet'});

  return useMemo(
    () => ({
      ...tracking,
      summaryTitle: 'Seguimiento de mascota finalizado',
    }),
    [tracking],
  );
}

export type UsePetTrackingResult = ReturnType<typeof usePetTracking>;