
import React from 'react';
import { User, ChevronDown, LayoutDashboard, Clock } from 'lucide-react';
import { UserProfile } from '../types';
import { AppLogo } from '../constants';

interface HeaderProps {
  activeTab: 'tracker' | 'dashboard' | 'profile';
  onTabChange: (tab: 'tracker' | 'dashboard' | 'profile') => void;
  profile: UserProfile | null;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, profile }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AppLogo size={44} />
          <div className="flex gap-3 text-[12px] font-bold uppercase tracking-wider text-slate-400">
            <button 
              onClick={() => onTabChange('tracker')}
              className={`flex items-center gap-1.5 transition-colors ${activeTab === 'tracker' ? 'text-[#0A1D47]' : 'hover:text-slate-600'}`}
            >
              <Clock size={14} /> Tracker
            </button>
            <button 
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-1.5 transition-colors ${activeTab === 'dashboard' ? 'text-[#0A1D47]' : 'hover:text-slate-600'}`}
            >
              <LayoutDashboard size={14} /> Report
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onTabChange('profile')}
            className={`flex items-center gap-1 p-1 pr-2 rounded-full transition-all border ${
              activeTab === 'profile' ? 'bg-blue-50 border-blue-200 text-[#0A1D47]' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <div className="bg-[#0A1D47] text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
              {profile ? profile.name[0].toUpperCase() : <User size={14} />}
            </div>
            <ChevronDown size={14} className={`transition-transform duration-200 ${activeTab === 'profile' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
