
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
              relative flex flex-col items-center justify-between p-2 py-4 rounded-xl border smooth-transition aspect-square
              ${isActive 
                ? 'bg-[#10b981] border-[#10b981] text-white shadow-lg active-glow z-10 scale-[1.02]' 
                : 'bg-white border-slate-200/60 text-slate-800 shadow-sm hover:border-slate-300'}
            `}
          >
            <div className={`smooth-transition mb-1 ${isActive ? 'text-white' : 'text-[#1e293b]'}`}>
              {activity.icon}
            </div>
            
            <span className={`text-[10px] md:text-[11px] font-bold leading-tight text-center tracking-tight font-en ${isActive ? 'text-white' : 'text-[#334155]'}`}>
              {activity.label}
            </span>

            {/* Screenshot style divider */}
            <div className={`w-full h-[1px] my-1 ${isActive ? 'bg-white/30' : 'bg-slate-100'}`} />

            <span className={`text-[10px] md:text-[11px] font-mono tracking-tighter font-bold ${isActive ? 'text-white/90' : 'text-slate-500'}`}>
              {formatTime(activities[activity.id])}
            </span>

            {isActive && (
              <div className="absolute top-1 right-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ActivityGrid;
