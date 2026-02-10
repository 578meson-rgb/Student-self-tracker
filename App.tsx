
import React, { useState, useEffect, useRef } from 'react';
import { ActivityType, DayData, UserProfile, AppState, ActiveSession, Task, PrayerState, AppNotification } from './types';
import Header from './components/Header';
import TrackerCard from './components/TrackerCard';
import ActivityGrid from './components/ActivityGrid';
import PrayerTracker from './components/PrayerTracker';
import Dashboard from './components/Dashboard';
import SettingsManager from './components/SettingsManager';
import Instructions from './components/Instructions';
import TodoManager from './components/TodoManager';
import NotificationToast from './components/NotificationToast';
import { formatTime } from './utils/formatters';
import { PRAYER_TIMES, MOTIVATIONAL_QUOTES, STUDY_TIPS, ACTIVITIES_CONFIG, APP_LOGO_URL } from './constants';

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
  const backgroundIntervalRef = useRef<any>(null);
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
      } catch (e) { console.error("Data load error", e); }
    }
    if ("Notification" in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
      profile, history, activeSession, tasks, notificationsEnabled: notifsEnabled
    }));
  }, [history, profile, activeSession, tasks, notifsEnabled]);

  // SYSTEM NOTIFICATION DISPATCHER
  const sendSystemNotification = (title: string, body: string, isTimer = false) => {
    if (!notifsEnabled || !("Notification" in window) || Notification.permission !== "granted") return null;
    
    try {
      // Use 'tag' to ensure we only have ONE timer notification in the tray at a time
      // Use type assertion 'as any' because 'renotify' might not be in the default NotificationOptions type definition in some TS environments
      const notif = new Notification(title, { 
        body, 
        icon: APP_LOGO_URL,
        tag: isTimer ? 'timer-status' : 'general-alert',
        renotify: isTimer ? false : true, // Don't buzz every minute for the timer
        silent: isTimer // Keep background timer silent to avoid annoying the user
      } as any);
      return notif;
    } catch (e) {
      console.warn("Notification error:", e);
      return null;
    }
  };

  // BACKGROUND HEARTBEAT - This is what shows the timer in the mobile notification bar
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && activeSession) {
        const updateBackgroundNotif = () => {
          const label = ACTIVITIES_CONFIG.find(a => a.id === activeSession.id)?.label || 'Activity';
          const elapsed = formatTime(displaySeconds);
          sendSystemNotification(
            `⏱️ ${label} Active`, 
            `Current Duration: ${elapsed}. Focus on your goals, ${profile?.name || 'Student'}!`,
            true
          );
        };

        // Send initial notification when user leaves
        updateBackgroundNotif();

        // Heartbeat: Update the notification every 60 seconds while app is in background
        backgroundIntervalRef.current = setInterval(updateBackgroundNotif, 60000);
      } else {
        // App is back in focus - stop background pings and clear system tray
        if (backgroundIntervalRef.current) clearInterval(backgroundIntervalRef.current);
        // We can't programmatically clear all specific system notifications easily without a service worker,
        // but stopping the re-send cycle is the most important part.
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (backgroundIntervalRef.current) clearInterval(backgroundIntervalRef.current);
    };
  }, [activeSession, displaySeconds, profile, notifsEnabled]);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support system notifications.");
      return;
    }

    try {
      // Compatibility wrapper for older browsers
      const status = await Notification.requestPermission();
      setPermissionStatus(status);
      
      if (status === 'granted') {
        sendSystemNotification("Access Granted! 🎉", "You will now see timer updates in your phone's notification bar.");
      } else if (status === 'denied') {
        console.log("Permission denied by user.");
      }
    } catch (err) {
      // Fallback for very old Safari
      Notification.requestPermission((status: NotificationPermission) => {
        setPermissionStatus(status);
      });
    }
  };

  const testNotification = () => {
    sendSystemNotification("Timer Test", "This is how the timer will look in your notification bar when you leave the app!");
  };

  // Toast logic (UI only)
  const addToastNotification = (title: string, message: string, type: AppNotification['type']) => {
    if (!notifsEnabled) return;
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title, message, type, timestamp: Date.now()
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 3));
  };

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
          const cur = newPrayers[key];
          if (cur === 'completed') return;
          const status: PrayerState = currentTimeStr > range.end ? 'missed' : 
                                      (currentTimeStr >= range.start ? 'active' : 'pending');
          if (cur !== status) { newPrayers[key] = status; changed = true; }
        });
        return changed ? { ...prev, [todayKey]: { ...day, prayers: newPrayers } } : prev;
      });
    };
    const interval = setInterval(checkPrayers, 30000);
    checkPrayers();
    return () => clearInterval(interval);
  }, []);

  // Timer logic
  useEffect(() => {
    if (!activeSession) { setDisplaySeconds(0); return; }
    const updateDisplay = () => {
      const curDay = history[getTodayKey()] || INITIAL_DAY_DATA;
      const base = curDay.activities[activeSession.id] || 0;
      const elapsed = Math.floor((Date.now() - activeSession.startTime) / 1000);
      setDisplaySeconds(base + elapsed);
    };
    updateDisplay();
    timerRef.current = setInterval(updateDisplay, 1000);
    return () => clearInterval(timerRef.current);
  }, [activeSession, history]);

  const currentDayData = history[getTodayKey()] || INITIAL_DAY_DATA;
  const totalTrackedSeconds = (Object.values(currentDayData.activities) as number[]).reduce((a: number, b: number) => a + b, 0);

  const handleToggleActivity = (id: ActivityType) => {
    const todayKey = getTodayKey();
    if (activeSession) {
      const elapsed = Math.floor((Date.now() - activeSession.startTime) / 1000);
      setHistory(prev => {
        const day = prev[todayKey] || { ...INITIAL_DAY_DATA };
        return { ...prev, [todayKey]: { ...day, activities: { ...day.activities, [activeSession.id]: (day.activities[activeSession.id] || 0) + elapsed } } };
      });
      if (activeSession.id === id) {
        setActiveSession(null);
        addToastNotification("Session Saved", `Finished: ${id.replace('_', ' ')}`, "reminder");
        return;
      }
    }
    setActiveSession({ id, startTime: Date.now() });
    addToastNotification("Session Started", `Now tracking: ${id.replace('_', ' ')}`, "reminder");
  };

  const handlePrayerChange = (key: keyof DayData['prayers']) => {
    const todayKey = getTodayKey();
    if (currentDayData.prayers[key] !== 'active' && currentDayData.prayers[key] !== 'completed') return;
    setHistory(prev => {
      const day = prev[todayKey] || { ...INITIAL_DAY_DATA };
      const next: PrayerState = day.prayers[key] === 'completed' ? 'active' : 'completed';
      if (next === 'completed') addToastNotification("Great Job!", `Prayer ${key} recorded.`, "motivation");
      return { ...prev, [todayKey]: { ...day, prayers: { ...day.prayers, [key]: next } } };
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 overflow-x-hidden">
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
            <PrayerTracker status={currentDayData.prayers} onChange={handlePrayerChange} />
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
      </main>
    </div>
  );
};

export default App;
