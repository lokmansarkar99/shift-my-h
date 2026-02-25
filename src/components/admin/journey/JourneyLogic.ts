// QUICK DEPLOY VERSION — minimal logic

export interface JourneyMetrics {
  stops: any[];
  totalDuration: number;
  totalDrivingTime: number;
  totalLoadingTime: number;
  totalWaitingTime: number;
  totalBufferTime: number;
  totalDistance: number;
  utilizationScore: number;
  startTime: string;
  endTime: string;
  isOverLimit: boolean;
}

export const JOURNEY_RULES = {
  MAX_JOURNEY_MINUTES: 540,
  WARNING_THRESHOLD_MINUTES: 480
};

export function calculateJourneyMetrics(
  stops: any[],
  startTime: string
): JourneyMetrics {
  return {
    stops,
    totalDuration: 0,
    totalDrivingTime: 0,
    totalLoadingTime: 0,
    totalWaitingTime: 0,
    totalBufferTime: 0,
    totalDistance: 0,
    utilizationScore: 0,
    startTime,
    endTime: startTime,
    isOverLimit: false
  };
}

export function optimizeStops(stops: any[]) {
  return stops;
}