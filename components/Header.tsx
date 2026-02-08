import React from 'react';
import { User, ChevronDown, LayoutDashboard, Clock, Info } from 'lucide-react';
import { UserProfile } from '../types';
import { AppLogo } from '../constants';

interface HeaderProps {
  activeTab: 'tracker' | 'dashboard' | 'profile' | 'instructions';
  onTabChange: (tab: 'tracker' | 'dashboard' | 'profile' | 'instructions') => void;
  profile: UserProfile | null;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, profile }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AppLogo size={52} />
          <nav className="flex gap-4 sm:gap-8 ml-4 sm:ml-8 text-[11px] sm:text-[13px] font-black uppercase tracking-[0.15em] text-slate-400">
            <button 
              onClick={() => onTabChange('tracker')}
              className={`flex items-center gap-2 py-2 transition-all ${
                activeTab === 'tracker' 
                ? 'text-[#0A1D47] border-b-2 border-[#0A1D47] scale-105' 
                : 'hover:text-slate-600 border-b-2 border-transparent'
              }`}
            >
              <Clock size={22} strokeWidth={2.5} /> 
              <span className="hidden xs:inline">Tracker</span>
            </button>
            <button 
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-2 py-2 transition-all ${
                activeTab === 'dashboard' 
                ? 'text-[#0A1D47] border-b-2 border-[#0A1D47] scale-105' 
                : 'hover:text-slate-600 border-b-2 border-transparent'
              }`}
            >
              <LayoutDashboard size={22} strokeWidth={2.5} /> 
              <span className="hidden xs:inline">Report</span>
            </button>
            <button 
              onClick={() => onTabChange('instructions')}
              className={`flex items-center gap-2 py-2 transition-all ${
                activeTab === 'instructions' 
                ? 'text-[#0A1D47] border-b-2 border-[#0A1D47] scale-105' 
                : 'hover:text-slate-600 border-b-2 border-transparent'
              }`}
            >
              <Info size={22} strokeWidth={2.5} /> 
              <span className="hidden xs:inline">Guide</span>
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onTabChange('profile')}
            className={`flex items-center gap-1.5 p-1.5 pr-2.5 rounded-full transition-all border-2 ${
              activeTab === 'profile' ? 'bg-blue-50 border-blue-200 text-[#0A1D47]' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <div className="bg-[#0A1D47] text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-md flex-shrink-0">
              {profile ? profile.name[0].toUpperCase() : <User size={18} strokeWidth={2.5} />}
            </div>
            <ChevronDown size={18} strokeWidth={2.5} className={`transition-transform duration-200 hidden xs:block ${activeTab === 'profile' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;