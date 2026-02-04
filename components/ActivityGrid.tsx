import React from 'react';
import { ACTIVITIES_CONFIG } from '../constants';
import { ActivityType } from '../types';
import { formatTime } from '../utils/formatters';

interface ActivityGridProps {
  activities: Record<ActivityType, number>;
  activeId: ActivityType | null;
  onToggle: (id: ActivityType) => void;
}

const ActivityGrid: React.FC<ActivityGridProps> = ({ activities, activeId, onToggle }) => {
  return (
    <div className="grid grid-cols-4 gap-2 md:gap-3">
      {ACTIVITIES_CONFIG.map((activity) => {
        const isActive = activeId === activity.id;
        return (
          <button
            key={activity.id}
            onClick={() => onToggle(activity.id)}
            className={`
              relative flex flex-col items-center justify-center p-2 pt-4 pb-3 rounded-[1.25rem] border smooth-transition min-h-[115px]
              ${isActive 
                ? 'bg-[#10b981] border-[#059669] text-white shadow-xl active-glow z-10 scale-[1.04]' 
                : 'bg-white border-slate-100 text-slate-800 shadow-sm hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5'}
            `}
          >
            {isActive && (
              <div className="absolute inset-0 bg-white/5 animate-pulse rounded-[1.25rem]" />
            )}

            <div className={`mb-2 smooth-transition ${isActive ? 'text-white scale-110' : 'text-[#0A1D47]'}`}>
              {activity.icon}
            </div>
            
            <span className={`text-[10px] md:text-[11px] font-black leading-tight text-center tracking-tight font-en mb-1 ${isActive ? 'text-white' : 'text-slate-700'}`}>
              {activity.label}
            </span>

            <div className={`w-8 h-[1px] mb-1.5 ${isActive ? 'bg-white/30' : 'bg-slate-100'}`} />

            <span className={`text-[10px] md:text-[11px] font-mono tracking-tighter font-black tabular-nums ${isActive ? 'text-white/90' : 'text-slate-400'}`}>
              {formatTime(activities[activity.id])}
            </span>

            {isActive && (
              <div className="absolute top-2 right-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ActivityGrid;