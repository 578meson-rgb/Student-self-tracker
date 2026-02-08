import React from 'react';

export type ActivityType = 
  | 'self_study' 
  | 'class' 
  | 'mobile_scroll' 
  | 'prayer' 
  | 'food' 
  | 'sleep' 
  | 'sports' 
  | 'other';

export interface PrayerStatus {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

export interface DayData {
  activities: Record<ActivityType, number>;
  prayers: PrayerStatus;
}

export interface UserProfile {
  name: string;
  studentClass: string;
}

export interface ActiveSession {
  id: ActivityType;
  startTime: number; // Date.now()
}

export interface AppState {
  profile: UserProfile | null;
  history: Record<string, DayData>; // Keyed by YYYY-MM-DD
  activeSession: ActiveSession | null;
}