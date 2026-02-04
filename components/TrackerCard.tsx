import React from 'react';
import { ACTIVITIES_CONFIG } from '../constants';
import { ActivityType } from '../types';
import { formatTime } from '../utils/formatters';

interface TrackerCardProps {
  activeActivity: ActivityType | null;
  currentTime: number;
  onFinish: () => void;
}

const TrackerCard: React.FC<TrackerCardProps> = ({ activeActivity, currentTime, onFinish }) => {
  const currentLabel = ACTIVITIES_CONFIG.find(a => a.id === activeActivity)?.label || 'Idle';

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-center space-y-6 smooth-transition">
      <div className="space-y-1">
        <p className="text-slate-400 font-extrabold text-[9px] uppercase tracking-[0.2em]">
          Current Activity: <span className={activeActivity ? "text-emerald-500" : "text-slate-300"}>{currentLabel}</span>
        </p>
        <div className={`text-6xl font-black tracking-tighter font-mono smooth-transition ${activeActivity ? 'text-slate-900' : 'text-slate-200'}`}>
          {formatTime(currentTime)}
        </div>
      </div>

      <button 
        onClick={onFinish}
        className="group relative bg-[#ef4444] hover:bg-red-600 text-white font-black py-3 px-10 rounded-2xl text-lg shadow-md smooth-transition active:scale-95 flex items-center gap-2 mx-auto"
      >
        Finish Activity
      </button>
    </div>
  );
};

export default TrackerCard;