import React, { useState, useEffect, useRef } from 'react';
import { ActivityType, DayData, UserProfile, AppState, ActiveSession } from './types';
import Header from './components/Header';
import TrackerCard from './components/TrackerCard';
import ActivityGrid from './components/ActivityGrid';
import PrayerTracker from './components/PrayerTracker';
import Dashboard from './components/Dashboard';
import ProfileSettings from './components/ProfileSettings';
import { formatTime } from './utils/formatters';

const STORAGE_KEY = 'student_tracker_master_v2';

const getTodayKey = () => new Date().toISOString().split('T')[0];

const INITIAL_DAY_DATA: DayData = {
  activities: {
    self_study: 0, class: 0, mobile_scroll: 0, prayer: 0,
    food: 0, sleep: 0, sports: 0, other: 0
  },
  prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false }
};

const App: React.FC = () => {
  const [view, setView] = useState<'tracker' | 'dashboard' | 'profile'>('tracker');
  const [history, setHistory] = useState<Record<string, DayData>>({});
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayKey());
  const [displaySeconds, setDisplaySeconds] = useState<number>(0);

  const timerRef = useRef<any>(null);

  // Load data on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: AppState = JSON.parse(saved);
        setProfile(parsed.profile);
        setHistory(parsed.history || {});
        if (parsed.activeSession) {
          setActiveSession(parsed.activeSession);
        }
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    const today = new Date();
    const cleanHistory = { ...history };
    // Keep only last 30 days
    Object.keys(cleanHistory).forEach(dateStr => {
      const date = new Date(dateStr);
      const diffTime = Math.abs(today.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 30) delete cleanHistory[dateStr];
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
      profile, 
      history: cleanHistory,
      activeSession 
    }));
  }, [history, profile, activeSession]);

  // Main Timer Logic: Robust against backgrounding
  useEffect(() => {
    const updateDisplay = () => {
      if (!activeSession) {
        setDisplaySeconds(0);
        return;
      }
      const todayKey = getTodayKey();
      const currentDay = history[todayKey] || INITIAL_DAY_DATA;
      const baseDuration = currentDay.activities[activeSession.id] || 0;
      const elapsedSinceStart = Math.floor((Date.now() - activeSession.startTime) / 1000);
      setDisplaySeconds(baseDuration + elapsedSinceStart);
    };

    if (activeSession) {
      updateDisplay();
      timerRef.current = setInterval(updateDisplay, 1000);
      
      // Handle returning to tab after long period
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          updateDisplay();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        clearInterval(timerRef.current);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    } else {
      setDisplaySeconds(0);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [activeSession, history]);

  const currentDayData = history[getTodayKey()] || INITIAL_DAY_DATA;
  const totalTrackedSeconds = (Object.values(currentDayData.activities) as number[]).reduce((a: number, b: number) => a + b, 0);

  const handleToggleActivity = (id: ActivityType) => {
    const todayKey = getTodayKey();
    
    // If stopping an activity
    if (activeSession) {
      const elapsed = Math.floor((Date.now() - activeSession.startTime) / 1000);
      setHistory(prev => {
        const day = prev[todayKey] || { ...INITIAL_DAY_DATA };
        return {
          ...prev,
          [todayKey]: {
            ...day,
            activities: {
              ...day.activities,
              [activeSession.id]: (day.activities[activeSession.id] || 0) + elapsed
            }
          }
        };
      });

      // If clicking the SAME activity, just stop
      if (activeSession.id === id) {
        setActiveSession(null);
        return;
      }
    }

    // Start new activity
    setActiveSession({ id, startTime: Date.now() });
  };

  const handlePrayerChange = (key: keyof DayData['prayers']) => {
    const todayKey = getTodayKey();
    setHistory(prev => {
      const day = prev[todayKey] || { ...INITIAL_DAY_DATA };
      return {
        ...prev,
        [todayKey]: {
          ...day,
          prayers: { ...day.prayers, [key]: !day.prayers[key] }
        }
      };
    });
  };

  const handleResetToday = () => {
    if (window.confirm('Do you want to reset today\'s progress?')) {
      const todayKey = getTodayKey();
      setHistory(prev => ({ ...prev, [todayKey]: { ...INITIAL_DAY_DATA } }));
      setActiveSession(null);
    }
  };

  const handleFinishDay = () => {
    if (activeSession) {
      handleToggleActivity(activeSession.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      <Header activeTab={view} onTabChange={setView} profile={profile} />

      <main className="max-w-xl mx-auto px-4 pt-8">
        {view === 'tracker' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-6 duration-700">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-[900] text-[#0A1D47] tracking-tighter italic uppercase">Daily Tracker</h1>
              {profile ? (
                <p className="text-slate-500 font-medium text-lg flex items-center justify-center gap-2">
                  <span className="opacity-50">—</span> 
                  Welcome, <span className="text-blue-600 font-bold">{profile.name}</span> <span className="text-slate-400 font-normal">(Class {profile.studentClass})</span>
                  <span className="opacity-50">—</span>
                </p>
              ) : (
                <button 
                  onClick={() => setView('profile')}
                  className="text-blue-600 font-bold text-sm underline underline-offset-4 mt-2 transition-all hover:text-blue-700"
                >
                  Create Your Profile
                </button>
              )}
              
              <div className="pt-2 flex flex-col items-center">
                <div className="bg-slate-100 px-4 py-1.5 rounded-full flex items-center gap-3">
                   <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Total Recorded Today</span>
                   <span className="w-px h-3 bg-slate-300"></span>
                   <span className="text-[13px] font-black text-[#0A1D47] font-mono tracking-wider tabular-nums">
                     {formatTime(activeSession ? totalTrackedSeconds + Math.floor((Date.now() - activeSession.startTime)/1000) : totalTrackedSeconds)}
                   </span>
                </div>
              </div>
            </div>

            <TrackerCard 
              activeActivity={activeSession?.id || null} 
              currentTime={displaySeconds || (activeSession ? currentDayData.activities[activeSession.id] : 0)} 
              onFinish={handleFinishDay}
            />

            <ActivityGrid 
              activities={currentDayData.activities}
              activeId={activeSession?.id || null}
              onToggle={handleToggleActivity}
              displaySeconds={displaySeconds}
            />

            <PrayerTracker 
              status={currentDayData.prayers}
              onChange={handlePrayerChange}
            />

            <div className="pt-4">
              <button 
                onClick={handleResetToday} 
                className="group flex items-center gap-2 mx-auto text-[11px] text-slate-400 font-black hover:text-red-500 transition-all uppercase tracking-widest border border-transparent hover:border-red-100 hover:bg-red-50 px-4 py-2 rounded-lg"
              >
                <span>Reset Today's Progress</span>
              </button>
            </div>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-right-6 duration-500">
            <Dashboard 
              history={history} 
              selectedDate={selectedDate} 
              onDateChange={setSelectedDate} 
            />
          </div>
        )}

        {view === 'profile' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
            <ProfileSettings 
              profile={profile} 
              onSave={(p) => { setProfile(p); setView('tracker'); }} 
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;