
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DayData, ActivityType } from '../types';
import { ACTIVITIES_CONFIG, PRAYER_LABELS } from '../constants';
import { formatDurationBrief } from '../utils/formatters';
import { Calendar } from 'lucide-react';

interface DashboardProps {
  history: Record<string, DayData>;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#94a3b8'];

const Dashboard: React.FC<DashboardProps> = ({ history, selectedDate, onDateChange }) => {
  const data = history[selectedDate] || {
    activities: { self_study: 0, class: 0, mobile_scroll: 0, prayer: 0, food: 0, sleep: 0, sports: 0, other: 0 },
    prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false }
  };

  const chartData = ACTIVITIES_CONFIG
    .map((act, index) => ({
      name: act.label,
      value: (data.activities[act.id] || 0) / 60,
      color: COLORS[index % COLORS.length]
    }))
    .filter(d => d.value > 0);

  // FIX: Using ACTIVITIES_CONFIG to ensure type safety when calculating total seconds
  const totalSeconds = ACTIVITIES_CONFIG.reduce((acc: number, act) => acc + (data.activities[act.id] || 0), 0);
  // FIX: Using PRAYER_LABELS for counting prayers to avoid Object.values type issues
  const prayerCount = PRAYER_LABELS.filter(p => data.prayers[p.id]).length;

  const availableDates = Object.keys(history).sort().reverse().slice(0, 30);

  return (
    <div className="space-y-6 pb-10">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-extrabold text-slate-800">Daily Report</h2>
        
        <div className="flex items-center justify-center gap-2">
          <Calendar size={18} className="text-blue-500" />
          <select 
            value={selectedDate} 
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-white border-slate-200 rounded-lg text-sm font-bold px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {availableDates.length > 0 ? (
              availableDates.map(date => (
                <option key={date} value={date}>{date === new Date().toISOString().split('T')[0] ? 'Today' : date}</option>
              ))
            ) : (
              <option value={selectedDate}>{selectedDate}</option>
            )}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Total Time</p>
          <p className="text-2xl font-black text-blue-600">{formatDurationBrief(totalSeconds)}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Prayers</p>
          <p className="text-2xl font-black text-green-600">{prayerCount}/5</p>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-700">Activities Breakdown</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-y-3 gap-x-6 mt-4">
            {chartData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs font-bold text-slate-600">{d.name}:</span>
                <span className="text-xs font-black text-slate-900 ml-auto">{Math.round(d.value)}m</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center text-slate-400 font-medium">
          এই দিনে কোনো তথ্য রেকর্ড করা হয়নি।
        </div>
      )}

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-700 mb-4">Prayer Summary</h3>
        <div className="grid grid-cols-5 gap-2">
          {PRAYER_LABELS.map(p => (
            <div 
              key={p.id} 
              className={`text-center p-2 rounded-xl border text-[11px] font-black ${
                data.prayers[p.id] ? 'bg-green-50 border-green-200 text-green-600' : 'bg-slate-50 border-slate-100 text-slate-300'
              }`}
            >
              {p.label}
              <div className="mt-1 text-base">
                {data.prayers[p.id] ? '✓' : '✗'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
