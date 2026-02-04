
import React from 'react';
import { 
  BookOpen, 
  Presentation, 
  Smartphone, 
  Utensils, 
  Bed, 
  Zap, 
  Briefcase 
} from 'lucide-react';
import { ActivityType } from './types';

// Provided Logo Image URL
export const APP_LOGO_URL = "https://i.ibb.co.com/DPq766Xs/Blue-Black-Study-Book-Logo.png";

export const AppLogo = ({ size = 40, className = "" }: { size?: number, className?: string }) => (
  <img 
    src={APP_LOGO_URL} 
    alt="Study Tracker Logo" 
    style={{ width: size, height: size, objectFit: 'contain' }}
    className={className}
  />
);

// Custom Mosque Icon SVG
const MosqueIcon = ({ size = 32 }: { size?: number }) => (
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
    <path d="M4 14a2 2 0 1 1 0-4 2 2 0 1 1 0 4Z" />
    <path d="M20 14a2 2 0 1 1 0-4 2 2 0 1 1 0 4Z" />
    <path d="M8 22v-4a4 4 0 1 1 8 0v4" />
  </svg>
);

export const ACTIVITIES_CONFIG: { id: ActivityType; label: string; icon: React.ReactNode }[] = [
  { id: 'self_study', label: 'Self Study', icon: <BookOpen size={28} strokeWidth={2.5} /> },
  { id: 'class', label: 'Class', icon: <Presentation size={28} strokeWidth={2.5} /> },
  { id: 'mobile_scroll', label: 'Mobile scroll', icon: <Smartphone size={28} strokeWidth={2.5} /> },
  { id: 'prayer', label: 'Prayer', icon: <MosqueIcon size={28} /> },
  { id: 'food', label: 'Food', icon: <Utensils size={28} strokeWidth={2.5} /> },
  { id: 'sleep', label: 'Sleep', icon: <Bed size={28} strokeWidth={2.5} /> },
  { id: 'sports', label: 'Sports', icon: <Zap size={28} strokeWidth={2.5} /> },
  { id: 'other', label: 'Other', icon: <Briefcase size={28} strokeWidth={2.5} /> },
];

export const PRAYER_LABELS = [
  { id: 'fajr', label: 'ফজর' },
  { id: 'dhuhr', label: 'যোহর' },
  { id: 'asr', label: 'আসর' },
  { id: 'maghrib', label: 'মাগ.' },
  { id: 'isha', label: 'এশা' },
] as const;
