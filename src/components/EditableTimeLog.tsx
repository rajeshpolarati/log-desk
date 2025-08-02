import { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
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
      toast.error("Invalid Time Format: Please use format like '9:00 AM' or '5:30 PM'");
      return;
    }

    if (sanitizedLogoutTime && !sanitizeInput.timeFormat(sanitizedLogoutTime)) {
      toast.error("Invalid Time Format: Please use format like '9:00 AM' or '5:30 PM'");
      return;
    }
    
    // Validate date integrity
    if (!sanitizeInput.dateInput(log.date)) {
      toast.error("Invalid Date: Log date is invalid or outside acceptable range");
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
    
    toast.success("Log entry has been updated successfully.");
  };

  const handleCancel = () => {
    setEditLoginTime(log.loginTime);
    setEditLogoutTime(log.logoutTime || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border bg-card hover:shadow-medium transition-all space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
          <div className="text-center">
            <p className="font-semibold">
              {new Date(log.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(log.date).toLocaleDateString('en-US', { 
                weekday: 'short' 
              })}
            </p>
          </div>
          <div className="h-px sm:h-8 w-full sm:w-px bg-border"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm flex-1">
            <div>
              <p className="text-muted-foreground mb-1">Login</p>
              <Input
                value={editLoginTime}
                onChange={(e) => setEditLoginTime(sanitizeInput.timeInput(e.target.value))}
                placeholder="9:00 AM"
                className="h-8"
                maxLength={8}
              />
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Logout</p>
              <Input
                value={editLogoutTime}
                onChange={(e) => setEditLogoutTime(sanitizeInput.timeInput(e.target.value))}
                placeholder="5:30 PM"
                className="h-8"
                maxLength={8}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} className="h-8 w-8 p-0">
            <Check className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border bg-card hover:shadow-medium transition-all group space-y-4 sm:space-y-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
        <div className="text-center">
          <p className="font-semibold">
            {new Date(log.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(log.date).toLocaleDateString('en-US', { 
              weekday: 'short' 
            })}
          </p>
        </div>
        <div className="h-px sm:h-8 w-full sm:w-px bg-border"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm flex-1">
          <div>
            <p className="text-muted-foreground">Login</p>
            <p className="font-medium">{log.loginTime}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Logout</p>
            <p className="font-medium">{log.logoutTime || 'In Progress'}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Duration</p>
          <p className="font-semibold text-primary">
            {log.duration || '—'}
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};