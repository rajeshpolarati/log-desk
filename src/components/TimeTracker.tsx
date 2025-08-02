import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, LogIn, LogOut, Timer, Settings } from 'lucide-react';
import { premiumToast } from '@/lib/toast';
import { ThemeToggle } from './ThemeToggle';
import { ResetButton } from './ResetButton';
import { EditableTimeLog } from './EditableTimeLog';
import { secureLocalStorage, sanitizeInput, dataIntegrity } from '@/lib/security';

interface TimeLog {
  date: string;
  loginTime: string;
  logoutTime?: string;
  duration?: string;
}

const TimeTracker = () => {
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [todayLog, setTodayLog] = useState<TimeLog | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const today = new Date().toISOString().split('T')[0];

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load logs from localStorage on mount with security validation
  useEffect(() => {
    const parsedLogs = secureLocalStorage.getTimeLogs();
    
    // Validate data integrity
    if (parsedLogs.length > 0 && !dataIntegrity.validateIntegrity(parsedLogs)) {
      premiumToast.dataIntegrityWarning();
    }
    
    setLogs(parsedLogs);
    
    // Find today's log
    const todaysEntry = parsedLogs.find((log: TimeLog) => log.date === today);
    setTodayLog(todaysEntry || null);
  }, [today]);

  // Save logs to localStorage whenever logs change with security validation
  useEffect(() => {
    if (logs.length === 0) return;
    
    const success = secureLocalStorage.setTimeLogs(logs);
    if (success) {
      dataIntegrity.updateChecksum(logs);
    } else {
      premiumToast.saveError();
    }
  }, [logs]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateDuration = (loginTime: string, logoutTime: string) => {
    const login = new Date(`${today}T${convertTo24Hour(loginTime)}`);
    const logout = new Date(`${today}T${convertTo24Hour(logoutTime)}`);
    const diffMs = logout.getTime() - login.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
    return `${hours.padStart(2, '0')}:${minutes}:00`;
  };

  const getExpectedLogout = (loginTime: string) => {
    const login = new Date(`${today}T${convertTo24Hour(loginTime)}`);
    const expectedLogout = new Date(login.getTime() + 8.5 * 60 * 60 * 1000); // Add 8.5 hours
    return formatTime(expectedLogout);
  };

  const handleLogin = () => {
    const now = new Date();
    const timeString = formatTime(now);
    
    const newLog: TimeLog = {
      date: today,
      loginTime: timeString
    };

    const updatedLogs = logs.filter(log => log.date !== today);
    updatedLogs.unshift(newLog);
    
    setLogs(updatedLogs);
    setTodayLog(newLog);
    
    premiumToast.loginSuccess(timeString);
  };

  const handleLogout = () => {
    if (!todayLog) return;
    
    const now = new Date();
    const timeString = formatTime(now);
    const duration = calculateDuration(todayLog.loginTime, timeString);
    
    const updatedLog: TimeLog = {
      ...todayLog,
      logoutTime: timeString,
      duration
    };

    const updatedLogs = logs.map(log => 
      log.date === today ? updatedLog : log
    );
    
    setLogs(updatedLogs);
    setTodayLog(updatedLog);
    
    premiumToast.logoutSuccess(timeString);
  };

  const handleReset = () => {
    setLogs([]);
    setTodayLog(null);
    localStorage.removeItem('timeLogs');
    localStorage.removeItem('timeLogs_checksum');
  };

  const handleUpdateLog = (index: number, updatedLog: TimeLog) => {
    const updatedLogs = [...logs];
    updatedLogs[index] = updatedLog;
    setLogs(updatedLogs);
    
    if (updatedLog.date === today) {
      setTodayLog(updatedLog);
    }
  };

  const canLogin = !todayLog;
  const canLogout = todayLog && !todayLog.logoutTime;
  const isCompleted = todayLog && todayLog.logoutTime;

  return (
    <div className="min-h-screen bg-gradient-header bg-pattern p-2 sm:p-4">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center py-6 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4 animate-float">
              <div className="relative">
                <Timer className="w-8 h-8 sm:w-10 sm:h-10 text-gradient animate-pulse-slow" />
                <div className="absolute inset-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-full animate-ping"></div>
              </div>
                      <h1 className="text-2xl sm:text-4xl font-bold text-gradient">
          Log Desk
        </h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {logs.length > 0 && <ResetButton onReset={handleReset} />}
            </div>
          </div>
                  <p className="text-muted-foreground text-sm sm:text-lg font-medium">
          Track your daily work hours with precision and style
        </p>
        </div>

        {/* Current Status Card */}
        <Card className="card-premium animate-float">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl">
              <div className="relative">
                <Clock className="w-6 h-6 text-gradient" />
                <div className="absolute inset-0 w-6 h-6 bg-blue-500/20 rounded-full animate-ping"></div>
              </div>
              Today's Status
            </CardTitle>
            <CardDescription className="text-lg font-medium text-muted-foreground">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Current Time Display */}
            <div className="text-center">
                              <div className="text-4xl sm:text-5xl font-mono font-bold text-gradient animate-glow tracking-wider">
                  {formatTime(currentTime)}
                </div>
                              <p className="text-base text-muted-foreground mt-3 font-medium">Current Time</p>
            </div>

            {/* Status Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/50 backdrop-blur-sm">
                <p className="text-sm text-muted-foreground font-medium mb-2">Login Time</p>
                <p className="font-bold text-base text-slate-700">
                  {todayLog?.loginTime || '—'}
                </p>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/50 backdrop-blur-sm">
                <p className="text-sm text-muted-foreground font-medium mb-2">Expected Logout</p>
                <p className="font-bold text-base text-slate-700">
                  {todayLog ? getExpectedLogout(todayLog.loginTime) : '—'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">(8h 30m shift)</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/50 backdrop-blur-sm">
                <p className="text-sm text-muted-foreground font-medium mb-2">Status</p>
                <div className={`badge-premium ${isCompleted ? "success" : canLogout ? "primary" : "secondary"}`}>
                  {isCompleted ? "Completed" : canLogout ? "Logged In" : "Not Started"}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button
                onClick={handleLogin}
                disabled={!canLogin}
                className={`btn-premium min-w-40 w-full sm:w-auto ${!canLogin ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-center gap-3">
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </div>
              </button>
              <button
                onClick={handleLogout}
                disabled={!canLogout}
                className={`btn-success-premium min-w-40 w-full sm:w-auto ${!canLogout ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-center gap-3">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </div>
              </button>
            </div>

            {/* Today's Progress */}
            {todayLog && (
              <div className="text-center p-6 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200/50 backdrop-blur-sm">
                <p className="text-sm text-muted-foreground mb-3 font-medium">Today's Duration</p>
                <p className="text-2xl font-bold text-gradient-success">
                  {todayLog.duration || 'In Progress...'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Time Logs History */}
        <Card className="card-premium">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="relative">
                <Settings className="w-6 h-6 text-gradient" />
                <div className="absolute inset-0 w-6 h-6 bg-blue-500/20 rounded-full animate-ping"></div>
              </div>
              Time Logs History
            </CardTitle>
            <CardDescription className="text-base font-medium">
              Your complete work time records - Click on any entry to edit
            </CardDescription>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="relative inline-block mb-6">
                  <Timer className="w-16 h-16 mx-auto opacity-50 animate-float" />
                  <div className="absolute inset-0 w-16 h-16 bg-blue-500/10 rounded-full animate-ping"></div>
                </div>
                <p className="text-lg font-medium">No time logs yet. Start by logging in!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log, index) => (
                  <EditableTimeLog
                    key={index}
                    log={log}
                    index={index}
                    onUpdate={handleUpdateLog}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimeTracker;