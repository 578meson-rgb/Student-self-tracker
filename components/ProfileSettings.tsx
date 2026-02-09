import React from 'react';
import { UserProfile } from '../types';
import { User, GraduationCap, Save, Bell, BellOff, ShieldCheck, AlertCircle, ExternalLink, Zap } from 'lucide-react';

interface ProfileSettingsProps {
  profile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
  notifsEnabled: boolean;
  setNotifsEnabled: (val: boolean) => void;
  permissionStatus: NotificationPermission;
  requestPermission: () => void;
  onTestNotif: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ 
  profile, 
  onSave, 
  notifsEnabled, 
  setNotifsEnabled, 
  permissionStatus, 
  requestPermission,
  onTestNotif
}) => {
  const [name, setName] = React.useState(profile?.name || '');
  const [studentClass, setStudentClass] = React.useState(profile?.studentClass || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && studentClass.trim()) {
      onSave({ name, studentClass });
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Form */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-[#0A1D47] rounded-full mx-auto flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-100">
            {name ? name[0].toUpperCase() : <User size={32} />}
          </div>
          <h2 className="text-2xl font-black text-[#0A1D47] uppercase italic tracking-tight">Your Identity</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
              <User size={12} /> Full Name
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Rahim Ahmed"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-700 shadow-inner"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
              <GraduationCap size={12} /> Current Class
            </label>
            <input 
              type="text" 
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              placeholder="Ex: HSC-25"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-700 shadow-inner"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#0A1D47] hover:bg-blue-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 uppercase tracking-widest italic"
          >
            <Save size={18} /> Update Profile
          </button>
        </form>
      </div>

      {/* Notification Center */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-[#0A1D47] uppercase italic text-sm tracking-tight flex items-center gap-2">
            <Bell size={18} className="text-blue-500" /> Notification Center
          </h3>
          <button 
            onClick={() => setNotifsEnabled(!notifsEnabled)}
            className={`w-12 h-6 rounded-full p-1 transition-all ${notifsEnabled ? 'bg-blue-600' : 'bg-slate-200'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-all ${notifsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="space-y-0.5">
              <p className="text-xs font-black text-slate-700 uppercase">System Permission</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Required for background tracking</p>
            </div>
            {permissionStatus === 'granted' ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck size={14} /> Allowed
              </div>
            ) : (
              <button 
                onClick={requestPermission}
                disabled={permissionStatus === 'denied'}
                className={`text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest transition-all ${
                  permissionStatus === 'denied' 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-90'
                }`}
              >
                {permissionStatus === 'denied' ? 'Blocked' : 'Request'}
              </button>
            )}
          </div>

          {permissionStatus === 'denied' && (
            <div className="p-5 bg-red-50 rounded-[2rem] border border-red-100 space-y-3">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle size={18} strokeWidth={3} />
                <p className="text-xs font-black uppercase tracking-tight">Why is this blocked?</p>
              </div>
              <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                You previously declined notifications. To fix this, look at the top-left of your browser (the Lock icon 🔒 next to the website URL), click it, and change "Notifications" to "Allow".
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black text-red-400 uppercase pt-1">
                <ExternalLink size={12} /> Check browser settings
              </div>
            </div>
          )}

          {permissionStatus === 'granted' && notifsEnabled && (
            <button 
              onClick={onTestNotif}
              className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100 hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
            >
              <Zap size={14} /> Test Timer Notification
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;