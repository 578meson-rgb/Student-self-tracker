import React, { useEffect } from 'react';
import { AppNotification } from '../types';
import { X, Bell, Zap, Lightbulb, Clock } from 'lucide-react';

interface NotificationToastProps {
  notifications: AppNotification[];
  removeNotification: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, removeNotification }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 sm:w-80 z-[100] pointer-events-none space-y-3">
      {notifications.map((n) => (
        <ToastItem key={n.id} notification={n} onRemove={() => removeNotification(n.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ notification: AppNotification; onRemove: () => void }> = ({ notification, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(onRemove, 10000); // Auto remove after 10s
    return () => clearTimeout(timer);
  }, [onRemove]);

  const icons = {
    motivation: <Zap className="text-amber-500" size={18} />,
    reminder: <Clock className="text-blue-500" size={18} />,
    tip: <Lightbulb className="text-emerald-500" size={18} />,
  };

  const bgColors = {
    motivation: 'bg-amber-50 border-amber-200',
    reminder: 'bg-blue-50 border-blue-200',
    tip: 'bg-emerald-50 border-emerald-200',
  };

  return (
    <div className={`
      pointer-events-auto w-full p-4 rounded-2xl border shadow-xl flex gap-3 animate-in slide-in-from-right-10 fade-in duration-500
      ${bgColors[notification.type]}
    `}>
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
        {icons[notification.type]}
      </div>
      <div className="flex-1 space-y-1 pr-4">
        <h4 className="text-xs font-black text-[#0A1D47] uppercase tracking-wider leading-none">
          {notification.title}
        </h4>
        <p className="text-[11px] font-bold text-slate-600 leading-tight italic">
          "{notification.message}"
        </p>
      </div>
      <button 
        onClick={onRemove}
        className="text-slate-400 hover:text-slate-600 transition-colors self-start p-1"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default NotificationToast;