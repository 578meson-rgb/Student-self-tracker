import React from 'react';
import { 
  BookOpen, 
  Monitor, 
  Smartphone, 
  Utensils, 
  Bed, 
  Zap, 
  MoreHorizontal 
} from 'lucide-react';
import { ActivityType } from './types';

export const APP_LOGO_URL = "https://i.ibb.co.com/jkrvZNxZ/Blue-Black-Study-Book-Logo-modified.png";

export const AppLogo = ({ size = 40, className = "" }: { size?: number, className?: string }) => (
  <img 
    src={APP_LOGO_URL} 
    alt="Study Tracker Logo" 
    style={{ width: size, height: size, objectFit: 'contain' }}
    className={className}
  />
);

const MosqueIcon = ({ size = 28 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 2v2" />
    <path d="M12 10a4 4 0 0 0-4 4v8h8v-8a4 4 0 0 0-4-4Z" />
    <path d="M4 14v8" />
    <path d="M20 14v8" />
    <path d="M2 22h20" />
    <path d="M8 22v-4a4 4 0 1 1 8 0v4" />
  </svg>
);

export const ACTIVITIES_CONFIG: { id: ActivityType; label: string; icon: React.ReactNode }[] = [
  { id: 'self_study', label: 'Self Study', icon: <BookOpen size={28} strokeWidth={2.5} /> },
  { id: 'class', label: 'Class', icon: <Monitor size={28} strokeWidth={2.5} /> },
  { id: 'mobile_scroll', label: 'Mobile scroll', icon: <Smartphone size={28} strokeWidth={2.5} /> },
  { id: 'prayer', label: 'Prayer', icon: <MosqueIcon size={28} /> },
  { id: 'food', label: 'Food', icon: <Utensils size={28} strokeWidth={2.5} /> },
  { id: 'sleep', label: 'Sleep', icon: <Bed size={28} strokeWidth={2.5} /> },
  { id: 'sports', label: 'Sports', icon: <Zap size={28} strokeWidth={2.5} /> },
  { id: 'other', label: 'Other', icon: <MoreHorizontal size={28} strokeWidth={2.5} /> },
];

export const MOTIVATIONAL_QUOTES = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The secret of getting ahead is getting started.",
  "Don't wish it were easier. Wish you were better.",
  "Education is the most powerful weapon which you can use to change the world.",
  "Believe you can and you're halfway there.",
  "The only place where success comes before work is in the dictionary.",
  "Your time is limited, so don't waste it living someone else's life.",
  "Hard work beats talent when talent doesn't work hard.",
  "It always seems impossible until it's done.",
  "Start where you are. Use what you have. Do what you can."
];

export const STUDY_TIPS = [
  "Use Active Recall: Test yourself instead of re-reading.",
  "Try the Pomodoro Technique: Study for 25 mins, break for 5.",
  "Space your learning: Don't cram, review at intervals.",
  "Explain it to a friend: If you can't explain it, you don't know it.",
  "Stay hydrated: Water helps your brain function better.",
  "Sleep is part of study: Your brain processes info while you sleep.",
  "Eliminate distractions: Put your phone in another room.",
  "Take handwritten notes: They help with memory retention."
];

// Estimated Time Ranges (Military Time HH:MM)
export const PRAYER_TIMES = {
  fajr: { start: "04:30", end: "06:15" },
  dhuhr: { start: "12:15", end: "15:30" },
  asr: { start: "15:45", end: "17:30" },
  maghrib: { start: "17:45", end: "19:00" },
  isha: { start: "19:15", end: "23:59" },
} as const;

export const PRAYER_LABELS = [
  { id: 'fajr', label: 'Fajr' },
  { id: 'dhuhr', label: 'Dhuhr' },
  { id: 'asr', label: 'Asr' },
  { id: 'maghrib', label: 'Maghrib' },
  { id: 'isha', label: 'Isha' },
] as const;