export type ActivityType = 'run' | 'ride' | 'pet';

export type RunStatus = 'preparing' | 'running' | 'paused' | 'finished';

export type TrackingPoint = {
  latitude: number;
  longitude: number;
  timestamp: number;
  speed?: number;
  altitude?: number | null;
};

export type TrackingSummary = {
  time: string;
  distance: string;
  speed: string;
  ascent?: string;
};
