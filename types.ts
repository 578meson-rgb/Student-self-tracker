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

export type PrayerState = 'completed' | 'missed' | 'pending' | 'active';

export interface PrayerStatus {
  fajr: PrayerState;
  dhuhr: PrayerState;
  asr: PrayerState;
  maghrib: PrayerState;
  isha: PrayerState;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
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

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'motivation' | 'reminder' | 'tip';
  timestamp: number;
}

export interface AppState {
  profile: UserProfile | null;
  history: Record<string, DayData>; // Keyed by YYYY-MM-DD
  activeSession: ActiveSession | null;
  tasks: Task[];
  notificationsEnabled: boolean;
}