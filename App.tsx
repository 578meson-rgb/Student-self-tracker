import React, { useState, useEffect, useRef } from 'react';
import { ActivityType, DayData, UserProfile, AppState, ActiveSession, Task, PrayerState, AppNotification } from './types';
import Header from './components/Header';
import TrackerCard from './components/TrackerCard';
import ActivityGrid from './components/ActivityGrid';
import PrayerTracker from './components/PrayerTracker';
import Dashboard from './components/Dashboard';
import ProfileSettings from './components/ProfileSettings';
import SettingsManager from './components/SettingsManager';
import Instructions from './components/Instructions';
import TodoManager from './components/TodoManager';
import NotificationToast from './components/NotificationToast';
import { formatTime } from './utils/formatters';
import { PRAYER_TIMES, MOTIVATIONAL_QUOTES, STUDY_TIPS, ACTIVITIES_CONFIG } from './constants';

const STORAGE_KEY = 'student_tracker_master_v3_notifs';

const getTodayKey = () => new Date().toISOString().split('T')[0];

const INITIAL_DAY_DATA: DayData = {
  activities: {
    self_study: 0, class: 0, mobile_scroll: 0, prayer: 0,
    food: 0, sleep: 0, sports: 0, other: 0
  },
  prayers: { fajr: 'pending', dhuhr: 'pending', asr: 'pending', maghrib: 'pending', isha: 'pending' }
};

const App: React.FC = () => {
  const [view, setView] = useState<'tracker' | 'dashboard' | 'profile' | 'instructions' | 'todo' | 'settings'>('tracker');
  const [history, setHistory] = useState<Record<string, DayData>>({});
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayKey());
  const [displaySeconds, setDisplaySeconds] = useState<number>(0);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notifsEnabled, setNotifsEnabled] = useState<boolean>(true);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>("default");

  const timerRef = useRef<any>(null);
  const lastInteractionRef = useRef<number>(Date.now());
  const backgroundNotifRef = useRef<Notification | null>(null);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: AppState = JSON.parse(saved);
        setProfile(parsed.profile);
        setHistory(parsed.history || {});
        setTasks(parsed.tasks || []);
        setNotifsEnabled(parsed.notificationsEnabled ?? true);
        if (parsed.activeSession) {
          setActiveSession(parsed.activeSession);
        }
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
    if ("Notification" in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
      profile, 
      history,
      activeSession,
      tasks,
      notificationsEnabled: notifsEnabled
    }));
  }, [history, profile, activeSession, tasks, notifsEnabled]);

  // System Notification Helper
  const sendSystemNotification = (title: string, body: string, tag?: string) => {
    if (notifsEnabled && "Notification" in window && Notification.permission === "granted") {
      try {
        const notif = new Notification(title, { 
          body, 
          icon: 'https://i.ibb.co.com/jkrvZNxZ/Blue-Black-Study-Book-Logo-modified.png',
          tag: tag || 'general',
          silent: false
        });
        return notif;
      } catch (e) {
        console.error("Notification creation failed", e);
      }
    }
    return null;
  };

  // Background Visibility Tracking
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && activeSession) {
        const label = ACTIVITIES_CONFIG.find(a => a.id === activeSession.id)?.label || 'Activity';
        const elapsed = formatTime(displaySeconds);
        backgroundNotifRef.current = sendSystemNotification(
          `⏱️ Still Tracking: ${label}`, 
          `Current time: ${elapsed}. We're still recording your progress, ${profile?.name || 'Student'}!`,
          'timer-notif'
        );
      } else if (document.visibilityState === 'visible') {
        if (backgroundNotifRef.current) {
          backgroundNotifRef.current.close();
          backgroundNotifRef.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [activeSession, displaySeconds, profile, notifsEnabled]);

  const requestPermission = async () => {
    if ("Notification" in window) {
      const status = await Notification.requestPermission();
      setPermissionStatus(status);
      if (status === 'granted') {
        sendSystemNotification("Success!", "Notifications are now active for your study tracker.");
      }
    }
  };

  const testNotification = () => {
    sendSystemNotification("Test Success!", "This is what your background study notifications will look like.");
  };

  // Toast logic
  const addToastNotification = (title: string, message: string, type: AppNotification['type']) => {
    if (!notifsEnabled) return;
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      timestamp: Date.now()
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 3));
  };

  // Background Quote/Tip Interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (!notifsEnabled || document.visibilityState === 'hidden') return;

      const rand = Math.random();
      if (activeSession?.id === 'self_study' || activeSession?.id === 'class') {
        if (rand > 0.7) {
          const tip = STUDY_TIPS[Math.floor(Math.random() * STUDY_TIPS.length)];
          addToastNotification("Study Tip", tip, "tip");
        }
      } else {
        if (rand > 0.8) {
          const quote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
          addToastNotification("Motivation", quote, "motivation");
        }
      }
    }, 15 * 60 * 1000); 

    return () => clearInterval(interval);
  }, [activeSession, notifsEnabled]);

  // Prayer Logic
  useEffect(() => {
    const checkPrayers = () => {
      const now = new Date();
      const todayKey = getTodayKey();
      const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      setHistory(prev => {
        const day = prev[todayKey] || { ...INITIAL_DAY_DATA };
        let changed = false;
        const newPrayers = { ...day.prayers };

        (Object.keys(PRAYER_TIMES) as Array<keyof typeof PRAYER_TIMES>).forEach(key => {
          const range = PRAYER_TIMES[key];
          const currentStatus = newPrayers[key];
          if (currentStatus === 'completed') return;
          if (currentTimeStr > range.end) {
            if (currentStatus !== 'missed') {
              newPrayers[key] = 'missed';
              changed = true;
            }
          } else if (currentTimeStr >= range.start && currentTimeStr <= range.end) {
            if (currentStatus !== 'active') {
              newPrayers[key] = 'active';
              changed = true;
            }
          } else {
             if (currentStatus !== 'pending') {
               newPrayers[key] = 'pending';
               changed = true;
             }
          }
        });

        if (!changed) return prev;
        return { ...prev, [todayKey]: { ...day, prayers: newPrayers } };
      });
    };
    const interval = setInterval(checkPrayers, 30000);
    checkPrayers();
    return () => clearInterval(interval);
  }, []);

  // Timer logic
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
      return () => clearInterval(timerRef.current);
    }
  }, [activeSession, history]);

  const currentDayData = history[getTodayKey()] || INITIAL_DAY_DATA;
  const totalTrackedSeconds = (Object.values(currentDayData.activities) as number[]).reduce((a: number, b: number) => a + b, 0);

  const handleToggleActivity = (id: ActivityType) => {
    lastInteractionRef.current = Date.now();
    const todayKey = getTodayKey();
    if (activeSession) {
      const elapsed = Math.floor((Date.now() - activeSession.startTime) / 1000);
      setHistory(prev => {
        const day = prev[todayKey] || { ...INITIAL_DAY_DATA };
        return {
          ...prev,
          [todayKey]: {
            ...day,
            activities: { ...day.activities, [activeSession.id]: (day.activities[activeSession.id] || 0) + elapsed }
          }
        };
      });
      if (activeSession.id === id) {
        setActiveSession(null);
        addToastNotification("Session Saved", `Finished: ${id.replace('_', ' ')}`, "reminder");
        return;
      }
    }
    setActiveSession({ id, startTime: Date.now() });
    addToastNotification("Session Started", `Tracking: ${id.replace('_', ' ')}`, "reminder");
  };

  const handlePrayerChange = (key: keyof DayData['prayers']) => {
    lastInteractionRef.current = Date.now();
    const todayKey = getTodayKey();
    const currentStatus = currentDayData.prayers[key];
    if (currentStatus !== 'active' && currentStatus !== 'completed') return;

    setHistory(prev => {
      const day = prev[todayKey] || { ...INITIAL_DAY_DATA };
      const nextState: PrayerState = day.prayers[key] === 'completed' ? 'active' : 'completed';
      if (nextState === 'completed') {
        addToastNotification("Great Job!", `You've completed your ${key} prayer.`, "motivation");
      }
      return { ...prev, [todayKey]: { ...day, prayers: { ...day.prayers, [key]: nextState } } };
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 overflow-x-hidden" onClick={() => lastInteractionRef.current = Date.now()}>
      <Header activeTab={view} onTabChange={setView} profile={profile} />

      <main className="max-w-xl mx-auto px-4 pt-8">
        <NotificationToast 
          notifications={notifications} 
          removeNotification={(id) => setNotifications(prev => prev.filter(n => n.id !== id))} 
        />

        {view === 'tracker' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-6 duration-700">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-[900] text-[#0A1D47] tracking-tighter italic uppercase">Daily Tracker</h1>
              <div className="bg-slate-100 px-4 py-1.5 rounded-full inline-flex items-center gap-3">
                 <span className="text-[13px] font-black text-[#0A1D47] font-mono tracking-wider">
                   {formatTime(activeSession ? totalTrackedSeconds + Math.floor((Date.now() - activeSession.startTime)/1000) : totalTrackedSeconds)}
                 </span>
              </div>
            </div>

            <TrackerCard 
              activeActivity={activeSession?.id || null} 
              currentTime={displaySeconds || (activeSession ? currentDayData.activities[activeSession.id] : 0)} 
              onFinish={() => activeSession && handleToggleActivity(activeSession.id)}
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
          </div>
        )}

        {view === 'todo' && <TodoManager tasks={tasks} setTasks={setTasks} />}
        {view === 'dashboard' && <Dashboard history={history} selectedDate={selectedDate} onDateChange={setSelectedDate} />}
        {view === 'instructions' && <Instructions onStart={() => setView('tracker')} />}
        
        {view === 'settings' && (
          <SettingsManager 
            profile={profile} 
            onSaveProfile={(p) => { setProfile(p); setView('tracker'); }} 
            notifsEnabled={notifsEnabled}
            setNotifsEnabled={setNotifsEnabled}
            permissionStatus={permissionStatus}
            requestPermission={requestPermission}
            onTestNotif={testNotification}
          />
        )}

        {view === 'profile' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ProfileSettings 
              profile={profile} 
              onSave={(p) => { setProfile(p); setView('tracker'); }} 
              notifsEnabled={notifsEnabled}
              setNotifsEnabled={setNotifsEnabled}
              permissionStatus={permissionStatus}
              requestPermission={requestPermission}
              onTestNotif={testNotification}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;