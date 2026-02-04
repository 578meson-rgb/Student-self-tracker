
import React, { useState, useEffect, useRef } from 'react';
import { ActivityType, DayData, UserProfile, AppState } from './types';
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
  const [activeActivity, setActiveActivity] = useState<ActivityType | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayKey());

  const timerRef = useRef<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: AppState = JSON.parse(saved);
        setProfile(parsed.profile);
        setHistory(parsed.history || {});
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
  }, []);

  useEffect(() => {
    const today = new Date();
    const cleanHistory = { ...history };
    Object.keys(cleanHistory).forEach(dateStr => {
      const date = new Date(dateStr);
      const diffTime = Math.abs(today.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 30) delete cleanHistory[dateStr];
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, history: cleanHistory }));
  }, [history, profile]);

  useEffect(() => {
    const todayKey = getTodayKey();
    if (activeActivity) {
      timerRef.current = setInterval(() => {
        setHistory(prev => {
          const currentDay = prev[todayKey] || { ...INITIAL_DAY_DATA };
          return {
            ...prev,
            [todayKey]: {
              ...currentDay,
              activities: {
                ...currentDay.activities,
                [activeActivity]: (currentDay.activities[activeActivity] || 0) + 1
              }
            }
          };
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeActivity]);

  const currentDayData = history[getTodayKey()] || INITIAL_DAY_DATA;
  const totalTrackedSeconds = Object.values(currentDayData.activities).reduce((a, b) => a + b, 0);

  const handleToggleActivity = (id: ActivityType) => {
    setActiveActivity(prev => (prev === id ? null : id));
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
    if (window.confirm('আজকের ডাটা কি মুছে ফেলতে চান?')) {
      const todayKey = getTodayKey();
      setHistory(prev => ({ ...prev, [todayKey]: { ...INITIAL_DAY_DATA } }));
      setActiveActivity(null);
    }
  };

  const handleFinishDay = () => {
    setActiveActivity(null); 
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20">
      <Header activeTab={view} onTabChange={setView} profile={profile} />

      <main className="max-w-xl mx-auto px-4 pt-6">
        {view === 'tracker' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="text-center space-y-1">
              <h1 className="text-3xl font-black text-[#0A1D47] tracking-tight font-en">STUDY TRACKER</h1>
              {profile ? (
                <p className="text-slate-500 font-semibold text-base font-bn">
                  স্বাগতম, {profile.name} (Class {profile.studentClass})
                </p>
              ) : (
                <button 
                  onClick={() => setView('profile')}
                  className="text-blue-600 font-bold text-sm underline underline-offset-4 mt-2 transition-colors hover:text-blue-700 font-bn"
                >
                  প্রোফাইল তৈরি করুন
                </button>
              )}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-en">Total Time:</span>
                 <span className="text-[11px] font-bold text-slate-600 font-en">{formatTime(totalTrackedSeconds)}</span>
              </div>
            </div>

            <TrackerCard 
              activeActivity={activeActivity} 
              currentTime={activeActivity ? currentDayData.activities[activeActivity] : 0} 
              onFinish={handleFinishDay}
            />

            <ActivityGrid 
              activities={currentDayData.activities}
              activeId={activeActivity}
              onToggle={handleToggleActivity}
            />

            <PrayerTracker 
              status={currentDayData.prayers}
              onChange={handlePrayerChange}
            />

            <button onClick={handleResetToday} className="block mx-auto text-[11px] text-slate-400 font-bold mt-8 hover:text-red-500 transition-colors uppercase tracking-widest font-bn">
              আজকের ডাটা রিসেট করুন
            </button>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <Dashboard 
              history={history} 
              selectedDate={selectedDate} 
              onDateChange={setSelectedDate} 
            />
          </div>
        )}

        {view === 'profile' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
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
