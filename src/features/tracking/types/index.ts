export type ActivityType = 'run' | 'ride' | 'pet';

export type RunStatus = 'preparing' | 'running' | 'paused' | 'finished';

export type TrackingPoint = {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number | null;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
};

export type TrackingSummary = {
  time: string;
  distance: string;
  speed: string;
  ascent?: string;
};