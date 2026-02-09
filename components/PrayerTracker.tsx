import React from 'react';
import { PRAYER_LABELS, PRAYER_TIMES } from '../constants';
import { PrayerStatus } from '../types';
import { Check, X, Clock, Lock } from 'lucide-react';

interface PrayerTrackerProps {
  status: PrayerStatus;
  onChange: (key: keyof PrayerStatus) => void;
}

const PrayerTracker: React.FC<PrayerTrackerProps> = ({ status, onChange }) => {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[#0A1D47] font-black italic uppercase tracking-wider flex items-center gap-2">
          Daily Prayer Journey
        </h3>
        <div className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">
          Time Restricted
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {PRAYER_LABELS.map((p) => {
          const state = status[p.id];
          const range = PRAYER_TIMES[p.id];
          
          let bgColor = "bg-slate-50 border-slate-100 text-slate-300 opacity-60";
          let icon = <Lock size={14} />;
          let statusText = "Locked";
          let actionText = `${range.start} - ${range.end}`;

          if (state === 'completed') {
            bgColor = "bg-emerald-50 border-emerald-500 text-emerald-700";
            icon = <Check size={16} strokeWidth={4} />;
            statusText = "Completed";
            actionText = "MashaAllah";
          } else if (state === 'missed') {
            bgColor = "bg-red-50 border-red-300 text-red-500";
            icon = <X size={16} strokeWidth={4} />;
            statusText = "Missed";
            actionText = "Time Expired";
          } else if (state === 'active') {
            bgColor = "bg-blue-50 border-blue-500 text-blue-700 shadow-sm animate-pulse";
            icon = <Clock size={16} className="animate-spin-slow" />;
            statusText = "Live Now";
            actionText = "Tap to Record";
          }

          return (
            <button
              key={p.id}
              onClick={() => onChange(p.id)}
              disabled={state !== 'active' && state !== 'completed'}
              className={`
                flex items-center justify-between px-5 py-4 rounded-2xl border transition-all active:scale-[0.98]
                ${bgColor}
              `}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center shadow-inner">
                  {icon}
                </div>
                <div className="text-left">
                  <p className="text-xs font-black uppercase tracking-widest opacity-60 leading-none mb-1">{p.label}</p>
                  <p className="font-black text-sm">{statusText}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-tighter opacity-70">{actionText}</p>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
        Prayers can only be marked during their valid time window
      </p>
    </div>
  );
};

export default PrayerTracker;