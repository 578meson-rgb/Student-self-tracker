import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  User, 
  GraduationCap, 
  Save, 
  Bell, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink, 
  Zap,
  Settings as SettingsIcon,
  ToggleLeft,
  ToggleRight,
  Loader2
} from 'lucide-react';

interface SettingsManagerProps {
  profile: UserProfile | null;
  onSaveProfile: (profile: UserProfile) => void;
  notifsEnabled: boolean;
  setNotifsEnabled: (val: boolean) => void;
  permissionStatus: NotificationPermission;
  requestPermission: () => void;
  onTestNotif: () => void;
}

const SettingsManager: React.FC<SettingsManagerProps> = ({ 
  profile, 
  onSaveProfile, 
  notifsEnabled, 
  setNotifsEnabled, 
  permissionStatus, 
  requestPermission,
  onTestNotif
}) => {
  const [name, setName] = React.useState(profile?.name || '');
  const [studentClass, setStudentClass] = React.useState(profile?.studentClass || '');
  const [isRequesting, setIsRequesting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && studentClass.trim()) {
      onSaveProfile({ name, studentClass });
    }
  };

  const handleRequest = async () => {
    setIsRequesting(true);
    await requestPermission();
    // Give it a small delay so user sees the "Processing" state
    setTimeout(() => setIsRequesting(false), 500);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-[#0A1D47] tracking-tighter uppercase italic flex items-center justify-center gap-3">
          <SettingsIcon size={32} /> App Settings
        </h2>
        <p className="text-slate-500 font-medium text-sm">Control your app experience</p>
      </div>

      {/* 1. Identity Card */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <User size={20} />
          </div>
          <h3 className="font-black text-[#0A1D47] uppercase italic text-sm tracking-tight">Student Identity</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Rahim Ahmed"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 transition-all font-bold text-slate-700"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Class/Batch</label>
              <input 
                type="text" 
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="Ex: HSC-2025"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 transition-all font-bold text-slate-700"
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-[#0A1D47] hover:bg-blue-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 uppercase tracking-widest italic"
          >
            <Save size={18} /> Update Profile
          </button>
        </form>
      </div>

      {/* 2. Notification Preferences Card */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Bell size={20} />
          </div>
          <h3 className="font-black text-[#0A1D47] uppercase italic text-sm tracking-tight">Preferences</h3>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="space-y-0.5">
            <p className="text-xs font-black text-slate-700 uppercase">Feature Toasts</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Motivational popup messages</p>
          </div>
          <button 
            onClick={() => setNotifsEnabled(!notifsEnabled)}
            className="text-blue-600 transition-all active:scale-90"
          >
            {notifsEnabled ? <ToggleRight size={36} /> : <ToggleLeft size={36} className="text-slate-300" />}
          </button>
        </div>

        {notifsEnabled && permissionStatus === 'granted' && (
          <button 
            onClick={onTestNotif}
            className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100 hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
          >
            <Zap size={14} /> Send Test System Notif
          </button>
        )}
      </div>

      {/* 3. System Access Card (Browser Permissions) */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <h3 className="font-black text-[#0A1D47] uppercase italic text-sm tracking-tight">System Access</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-black text-slate-700 uppercase">Background Tracking</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">For notifications outside the app</p>
            </div>
            {permissionStatus === 'granted' ? (
              <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck size={14} /> Authorized
              </div>
            ) : (
              <button 
                onClick={handleRequest}
                disabled={permissionStatus === 'denied' || isRequesting}
                className={`text-[10px] font-black px-6 py-2 rounded-xl uppercase tracking-widest transition-all flex items-center gap-2 ${
                  permissionStatus === 'denied' 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-90'
                }`}
              >
                {isRequesting ? <Loader2 size={12} className="animate-spin" /> : null}
                {permissionStatus === 'denied' ? 'Access Denied' : 'Grant Access'}
              </button>
            )}
          </div>

          {permissionStatus === 'denied' && (
            <div className="p-6 bg-red-50 rounded-[2rem] border border-red-100 space-y-4">
              <div className="flex items-center gap-3 text-red-600">
                <AlertCircle size={20} strokeWidth={3} />
                <p className="text-xs font-black uppercase tracking-tight italic underline">Permissions are Blocked!</p>
              </div>
              <div className="space-y-3">
                <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                  You blocked notifications earlier. Since the button can't ask you again, you must fix it manually:
                </p>
                <div className="space-y-2 bg-white/50 p-4 rounded-xl border border-red-50">
                   <p className="text-[10px] font-black text-slate-700 uppercase">📱 Mobile (Chrome/Safari):</p>
                   <p className="text-[10px] text-slate-500 font-medium">Click the <span className="text-red-500 font-black">Lock Icon (🔒)</span> in the address bar → Site Settings → Notifications → <span className="text-blue-600 font-black">Allow</span>.</p>
                   
                   <p className="text-[10px] font-black text-slate-700 uppercase mt-3">💻 Desktop:</p>
                   <p className="text-[10px] text-slate-500 font-medium">Click the <span className="text-red-500 font-black">Lock Icon (🔒)</span> next to the website link → Toggle <span className="text-blue-600 font-black">Notifications</span> ON.</p>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between text-[9px] font-black text-red-400 uppercase tracking-widest">
                <span>Refresh app after fixing</span>
                <ExternalLink size={14} className="opacity-50" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
