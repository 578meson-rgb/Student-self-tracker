
import React from 'react';
import { PRAYER_LABELS } from '../constants';
import { PrayerStatus } from '../types';

interface PrayerTrackerProps {
  status: PrayerStatus;
  onChange: (key: keyof PrayerStatus) => void;
}

const PrayerTracker: React.FC<PrayerTrackerProps> = ({ status, onChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
      <h3 className="text-slate-700 font-bold flex items-center gap-2">
        নামাজ ট্র্যাকিং
      </h3>
      <div className="flex justify-between gap-2">
        {PRAYER_LABELS.map((p) => (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            className={`
              flex-1 py-3 rounded-xl border font-bold text-sm transition-all
              ${status[p.id] 
                ? 'bg-green-50 border-green-500 text-green-700' 
                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}
            `}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PrayerTracker;
