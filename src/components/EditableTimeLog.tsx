import { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { premiumToast } from '@/lib/toast';
import { sanitizeInput } from '@/lib/security';

interface TimeLog {
  date: string;
  loginTime: string;
  logoutTime?: string;
  duration?: string;
}

interface EditableTimeLogProps {
  log: TimeLog;
  index: number;
  onUpdate: (index: number, updatedLog: TimeLog) => void;
}

export const EditableTimeLog = ({ log, index, onUpdate }: EditableTimeLogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLoginTime, setEditLoginTime] = useState(log.loginTime);
  const [editLogoutTime, setEditLogoutTime] = useState(log.logoutTime || '');

  const calculateDuration = (loginTime: string, logoutTime: string) => {
    if (!loginTime || !logoutTime) return '';
    
    const convertTo24Hour = (time12h: string) => {
      const [time, modifier] = time12h.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') hours = '00';
      if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
      return `${hours.padStart(2, '0')}:${minutes}:00`;
    };

    try {
      const login = new Date(`${log.date}T${convertTo24Hour(loginTime)}`);
      const logout = new Date(`${log.date}T${convertTo24Hour(logoutTime)}`);
      const diffMs = logout.getTime() - login.getTime();
      
      if (diffMs < 0) return 'Invalid';
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    } catch {
      return 'Invalid';
    }
  };

  const handleSave = () => {
    // Sanitize inputs before validation
    const sanitizedLoginTime = sanitizeInput.timeInput(editLoginTime);
    const sanitizedLogoutTime = editLogoutTime ? sanitizeInput.timeInput(editLogoutTime) : '';
    
    // Validate sanitized inputs
    if (!sanitizeInput.timeFormat(sanitizedLoginTime)) {
      premiumToast.invalidTimeFormat();
      return;
    }

    if (sanitizedLogoutTime && !sanitizeInput.timeFormat(sanitizedLogoutTime)) {
      premiumToast.invalidTimeFormat();
      return;
    }
    
    // Validate date integrity
    if (!sanitizeInput.dateInput(log.date)) {
      premiumToast.invalidDate();
      return;
    }

    const duration = sanitizedLogoutTime ? calculateDuration(sanitizedLoginTime, sanitizedLogoutTime) : undefined;
    
    const updatedLog: TimeLog = {
      ...log,
      loginTime: sanitizedLoginTime,
      logoutTime: sanitizedLogoutTime || undefined,
      duration
    };

    onUpdate(index, updatedLog);
    setIsEditing(false);
    
    premiumToast.timeUpdated();
  };

  const handleCancel = () => {
    setEditLoginTime(log.loginTime);
    setEditLogoutTime(log.logoutTime || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-xl border border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-gray-50/50 backdrop-blur-sm hover:shadow-medium transition-all space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1">
          <div className="text-center">
                      <p className="font-bold text-base text-slate-700">
            {new Date(log.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
            <p className="text-sm text-muted-foreground font-medium">
              {new Date(log.date).toLocaleDateString('en-US', { 
                weekday: 'short' 
              })}
            </p>
          </div>
          <div className="h-px sm:h-8 w-full sm:w-px bg-gradient-to-b from-slate-200 to-gray-200"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm flex-1">
            <div>
              <p className="text-muted-foreground mb-2 font-medium">Login</p>
              <input
                value={editLoginTime}
                onChange={(e) => setEditLoginTime(sanitizeInput.timeInput(e.target.value))}
                placeholder="9:00 AM"
                className="input-premium w-full"
                maxLength={8}
              />
            </div>
            <div>
              <p className="text-muted-foreground mb-2 font-medium">Logout</p>
              <input
                value={editLogoutTime}
                onChange={(e) => setEditLogoutTime(sanitizeInput.timeInput(e.target.value))}
                placeholder="5:30 PM"
                className="input-premium w-full"
                maxLength={8}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={handleSave} className="btn-success-premium h-10 w-10 p-0 rounded-lg">
            <div className="flex items-center justify-center w-full h-full">
              <Check className="w-5 h-5" />
            </div>
          </button>
          <button onClick={handleCancel} className="btn-destructive-premium h-10 w-10 p-0 rounded-lg">
            <div className="flex items-center justify-center w-full h-full">
              <X className="w-5 h-5" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-xl border border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-gray-50/50 backdrop-blur-sm hover:shadow-medium transition-all group space-y-4 sm:space-y-0 hover:scale-[1.02]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1">
        <div className="text-center">
          <p className="font-bold text-base text-slate-700">
            {new Date(log.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-sm text-muted-foreground font-medium">
            {new Date(log.date).toLocaleDateString('en-US', { 
              weekday: 'short' 
            })}
          </p>
        </div>
        <div className="h-px sm:h-8 w-full sm:w-px bg-gradient-to-b from-slate-200 to-gray-200"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 text-sm flex-1">
          <div>
            <p className="text-muted-foreground font-medium mb-1">Login</p>
            <p className="font-bold text-slate-700">{log.loginTime}</p>
          </div>
          <div>
            <p className="text-muted-foreground font-medium mb-1">Logout</p>
            <p className="font-bold text-slate-700">{log.logoutTime || 'In Progress'}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm text-muted-foreground font-medium">Duration</p>
          <p className="font-bold text-base text-gradient-success">
            {log.duration || '—'}
          </p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="h-10 w-10 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg bg-gradient-to-r from-slate-600 to-gray-600 text-white hover:scale-110"
          style={{ boxShadow: 'var(--shadow-glow)' }}
        >
          <div className="flex items-center justify-center w-full h-full">
            <Edit2 className="w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
  );
};