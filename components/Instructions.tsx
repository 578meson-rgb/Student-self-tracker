import React from 'react';
import { 
  Zap, 
  Target, 
  BarChart3, 
  ShieldCheck, 
  PlayCircle, 
  Timer, 
  BookOpen, 
  CheckCircle2 
} from 'lucide-react';

interface InstructionsProps {
  onStart: () => void;
}

const Instructions: React.FC<InstructionsProps> = ({ onStart }) => {
  const sections = [
    {
      title: "How to Track",
      icon: <Timer className="text-emerald-500" size={24} />,
      content: "Simply tap any activity card to start recording time. The app uses 'Smart Timestamps', meaning it keeps counting even if you close the browser or turn off your phone.",
      steps: [
        "Tap an activity to start",
        "Tap the same activity to stop",
        "Switch activities instantly by tapping another"
      ]
    },
    {
      title: "Daily Reports",
      icon: <BarChart3 className="text-blue-500" size={24} />,
      content: "Check the 'Report' tab to see a beautiful pie chart breakdown of your day. You can view history for the last 30 days using the date selector.",
      steps: [
        "View activity percentages",
        "Check total daily productivity",
        "Monitor long-term trends"
      ]
    },
    {
      title: "Prayer Monitoring",
      icon: <Target className="text-amber-500" size={24} />,
      content: "The prayer section acts as a daily checklist. Marking your prayers helps you stay consistent and disciplined throughout the day.",
      steps: [
        "Check off prayers as you finish",
        "See daily completion status",
        "Track consistency over time"
      ]
    },
    {
      title: "Data Privacy",
      icon: <ShieldCheck className="text-slate-500" size={24} />,
      content: "All your data is stored locally on your device's browser. We don't use external databases, ensuring your personal routine stays private to you.",
      steps: [
        "100% Local Storage",
        "No login required",
        "Your data belongs to you"
      ]
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-black text-[#0A1D47] tracking-tighter uppercase italic">User Guide</h2>
        <p className="text-slate-500 font-medium">Master your daily routine with these tips</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                {section.icon}
              </div>
              <h3 className="text-lg font-black text-[#0A1D47] uppercase tracking-tight italic">
                {section.title}
              </h3>
            </div>
            
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              {section.content}
            </p>

            <div className="space-y-2">
              {section.steps.map((step, sIdx) => (
                <div key={sIdx} className="flex items-center gap-3 text-xs font-bold text-slate-400">
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#0A1D47] rounded-[2rem] p-8 text-center space-y-6 shadow-xl">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-2">
          <PlayCircle className="text-white" size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-white italic uppercase tracking-wider">Ready to be productive?</h3>
          <p className="text-slate-300 text-sm max-w-xs mx-auto">Start your first activity now and see how much time you save today.</p>
        </div>
        <button 
          onClick={onStart}
          className="w-full bg-blue-500 hover:bg-blue-400 text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 uppercase tracking-widest italic"
        >
          Open Tracker
        </button>
      </div>

      <div className="text-center pt-4">
        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
          Pro Tip: Switch tabs to see your daily progress instantly
        </p>
      </div>
    </div>
  );
};

export default Instructions;