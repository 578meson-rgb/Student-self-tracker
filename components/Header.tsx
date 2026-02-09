import React from 'react';
import { User, ChevronDown, LayoutDashboard, Clock, Info, CheckSquare, Settings } from 'lucide-react';
import { UserProfile } from '../types';
import { AppLogo } from '../constants';

interface HeaderProps {
  activeTab: 'tracker' | 'dashboard' | 'profile' | 'instructions' | 'todo' | 'settings';
  onTabChange: (tab: 'tracker' | 'dashboard' | 'profile' | 'instructions' | 'todo' | 'settings') => void;
  profile: UserProfile | null;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, profile }) => {
  const navItems = [
    { id: 'tracker', label: 'Tracker', icon: Clock },
    { id: 'todo', label: 'Tasks', icon: CheckSquare },
    { id: 'dashboard', label: 'Report', icon: LayoutDashboard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AppLogo size={52} />
          <nav className="flex gap-4 sm:gap-6 ml-3 sm:ml-6 text-[11px] sm:text-[13px] font-black uppercase tracking-[0.15em] text-slate-400">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => onTabChange(item.id as any)}
                className={`flex flex-col sm:flex-row items-center gap-1.5 py-1 transition-all ${
                  activeTab === item.id 
                  ? 'text-[#0A1D47] border-b-2 border-[#0A1D47] scale-105' 
                  : 'hover:text-slate-600 border-b-2 border-transparent'
                }`}
              >
                <item.icon size={22} strokeWidth={2.5} /> 
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onTabChange('profile')}
            className={`flex items-center gap-1.5 p-1 rounded-full transition-all border-2 ${
              activeTab === 'profile' ? 'bg-blue-50 border-blue-200 text-[#0A1D47]' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <div className="bg-[#0A1D47] text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-md flex-shrink-0">
              {profile ? profile.name[0].toUpperCase() : <User size={20} strokeWidth={2.5} />}
            </div>
            <ChevronDown size={18} strokeWidth={2.5} className="hidden xs:block" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;