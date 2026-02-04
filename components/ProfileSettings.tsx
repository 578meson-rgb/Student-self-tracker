
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, GraduationCap, Save } from 'lucide-react';

interface ProfileSettingsProps {
  profile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profile, onSave }) => {
  const [name, setName] = useState(profile?.name || '');
  const [studentClass, setStudentClass] = useState(profile?.studentClass || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && studentClass.trim()) {
      onSave({ name, studentClass });
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-100">
          {name ? name[0].toUpperCase() : <User size={32} />}
        </div>
        <h2 className="text-2xl font-bold text-slate-800">আপনার প্রোফাইল</h2>
        <p className="text-slate-400 text-sm font-medium">আপনার নাম এবং ক্লাস যুক্ত করুন</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
            <User size={14} /> পূর্ণ নাম
          </label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Rahim Ahmed"
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
            <GraduationCap size={14} /> বর্তমান ক্লাস
          </label>
          <input 
            type="text" 
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            placeholder="Ex: 10 or HSC-25"
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            required
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <Save size={18} /> সেভ করুন
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
