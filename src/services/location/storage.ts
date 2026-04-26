import type {ActivityType, TrackingPoint} from '../../features/tracking/types';
import {
  clearTrackingSession,
  createIdleTrackingSnapshot,
  loadTrackingSession,
  saveTrackingSession,
  type TrackingSessionSnapshot,
} from './sessionStore';

export type TrackingSnapshot = TrackingSessionSnapshot;
export type {ActivityType, TrackingPoint};

export {
  clearTrackingSession,
  createIdleTrackingSnapshot,
  loadTrackingSession as readTrackingSession,
  saveTrackingSession as writeTrackingSession,
};
