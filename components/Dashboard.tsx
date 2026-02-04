import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
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
    activities: { self_study: 0, class: 0, mobile_scroll: 0, prayer: 0, food: 0, sleep: 0, sports: 0, other: 0 } as Record<ActivityType, number>,
    prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false }
  };

  const chartData = ACTIVITIES_CONFIG
    .map((act, index) => {
      const val = data.activities[act.id] || 0;
      return {
        name: act.label,
        value: Math.round((val / 60) * 10) / 10, // minutes with one decimal
        color: COLORS[index % COLORS.length]
      };
    })
    .filter(d => d.value > 0);

  const totalSeconds = ACTIVITIES_CONFIG.reduce((acc, act) => acc + (data.activities[act.id] || 0), 0);
  const prayerCount = PRAYER_LABELS.filter(p => data.prayers[p.id]).length;

  const availableDates = Object.keys(history).sort().reverse().slice(0, 30);
  const todayKey = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 pb-10">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-extrabold text-[#0A1D47] tracking-tight">Daily Report</h2>
        
        <div className="flex items-center justify-center gap-2">
          <Calendar size={18} className="text-blue-500" />
          <select 
            value={selectedDate} 
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-white border-slate-200 border rounded-xl text-sm font-bold px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 smooth-transition"
          >
            {availableDates.length > 0 ? (
              availableDates.map(date => (
                <option key={date} value={date}>{date === todayKey ? 'Today' : date}</option>
              ))
            ) : (
              <option value={selectedDate}>{selectedDate === todayKey ? 'Today' : selectedDate}</option>
            )}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Total Tracked</p>
          <p className="text-2xl font-black text-blue-600 font-mono">{formatDurationBrief(totalSeconds)}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Prayers</p>
          <p className="text-2xl font-black text-green-600 font-mono">{prayerCount}/5</p>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 overflow-hidden">
          <h3 className="font-bold text-slate-700">Activities Breakdown</h3>
          <div className="h-[280px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1000}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontVariantNumeric: 'tabular-nums' }}
                  formatter={(value: number) => [`${value} min`, 'Duration']}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Total</p>
                <p className="text-xl font-black text-slate-700 font-mono">{Math.round(totalSeconds / 60)}m</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-3 gap-x-6 mt-4 pt-4 border-t border-slate-50">
            {chartData.map((d, i) => (
              <div key={i} className="flex items-center gap-2 group">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-[11px] font-bold text-slate-500 truncate group-hover:text-slate-800 transition-colors">{d.name}</span>
                <span className="text-[11px] font-black text-slate-900 ml-auto font-mono">{d.value}m</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-16 rounded-3xl border border-slate-100 shadow-sm text-center space-y-2">
          <div className="text-4xl">📊</div>
          <p className="text-slate-400 font-bold text-sm">এই দিনে কোনো তথ্য রেকর্ড করা হয়নি।</p>
          <p className="text-slate-300 text-xs">অ্যাক্টিভিটি ট্র্যাক করা শুরু করলে এখানে চার্ট দেখা যাবে।</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-700 mb-4">Prayer Summary</h3>
        <div className="grid grid-cols-5 gap-2">
          {PRAYER_LABELS.map(p => (
            <div 
              key={p.id} 
              className={`text-center p-2 rounded-xl border text-[11px] font-black transition-all ${
                data.prayers[p.id] ? 'bg-green-50 border-green-200 text-green-600 scale-105 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-300'
              }`}
            >
              {p.label}
              <div className={`mt-1 text-base ${data.prayers[p.id] ? 'animate-bounce' : ''}`}>
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