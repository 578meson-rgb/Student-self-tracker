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
    <div className="grid grid-cols-4 gap-2 md:gap-4">
      {ACTIVITIES_CONFIG.map((activity) => {
        const isActive = activeId === activity.id;
        return (
          <button
            key={activity.id}
            onClick={() => onToggle(activity.id)}
            className={`
              relative flex flex-col items-center justify-center p-2 pt-5 pb-4 rounded-[1.5rem] border smooth-transition min-h-[125px]
              ${isActive 
                ? 'bg-[#10b981] border-[#059669] text-white shadow-xl active-glow z-10 scale-[1.05]' 
                : 'bg-white border-slate-100 text-slate-800 shadow-sm hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5'}
            `}
          >
            {isActive && (
              <div className="absolute inset-0 bg-white/10 animate-pulse rounded-[1.5rem]" />
            )}

            <div className={`mb-3 smooth-transition ${isActive ? 'text-white scale-110' : 'text-[#0A1D47]'}`}>
              {activity.icon}
            </div>
            
            <div className="flex flex-col items-center w-full">
              <span className={`text-[10px] md:text-[11px] font-black leading-tight text-center tracking-tight font-en uppercase mb-1.5 ${isActive ? 'text-white' : 'text-slate-600'}`}>
                {activity.label}
              </span>

              <div className={`w-6 h-[1.5px] mb-2 rounded-full ${isActive ? 'bg-white/40' : 'bg-slate-100'}`} />

              <span className={`text-[11px] md:text-[12px] font-mono tracking-tighter font-black tabular-nums ${isActive ? 'text-white' : 'text-slate-400'}`}>
                {formatTime(activities[activity.id])}
              </span>
            </div>

            {isActive && (
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-white rounded-full animate-ping shadow-sm" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ActivityGrid;