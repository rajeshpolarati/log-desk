import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, LogIn, LogOut, Timer, Settings } from 'lucide-react';
import { toast } from 'sonner';
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
      toast.error("Data Integrity Warning: Some data may have been corrupted. Please verify your time logs.");
    }
    
    setLogs(parsedLogs);
    
    // Find today's log
    const todaysEntry = parsedLogs.find((log: TimeLog) => log.date === today);
    setTodayLog(todaysEntry || null);
  }, [today, toast]);

  // Save logs to localStorage whenever logs change with security validation
  useEffect(() => {
    if (logs.length === 0) return;
    
    const success = secureLocalStorage.setTimeLogs(logs);
    if (success) {
      dataIntegrity.updateChecksum(logs);
    } else {
      toast.error("Save Error: Failed to save time logs. Please try again.");
    }
  }, [logs, toast]);

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
    
    toast.success(`Login time recorded: ${timeString}`);
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
    
    toast.success(`Logout time recorded: ${timeString}`);
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
    <div className="min-h-screen bg-gradient-header p-2 sm:p-4">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center py-4 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Timer className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Time Tracker
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {logs.length > 0 && <ResetButton onReset={handleReset} />}
            </div>
          </div>
          <p className="text-muted-foreground text-sm sm:text-lg">
            Track your daily work hours with precision
          </p>
        </div>

        {/* Current Status Card */}
        <Card className="shadow-large">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5" />
              Today's Status
            </CardTitle>
            <CardDescription>
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Time Display */}
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-primary">
                {formatTime(currentTime)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Current Time</p>
            </div>

            {/* Status Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-accent/50">
                <p className="text-sm text-muted-foreground">Login Time</p>
                <p className="font-semibold">
                  {todayLog?.loginTime || '—'}
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-accent/50">
                <p className="text-sm text-muted-foreground">Expected Logout</p>
                <p className="font-semibold">
                  {todayLog ? getExpectedLogout(todayLog.loginTime) : '—'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">(8h 30m shift)</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-accent/50">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={isCompleted ? "secondary" : canLogout ? "default" : "outline"}>
                  {isCompleted ? "Completed" : canLogout ? "Logged In" : "Not Started"}
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                variant="login"
                size="lg"
                onClick={handleLogin}
                disabled={!canLogin}
                className="min-w-32 w-full sm:w-auto"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Button>
              <Button
                variant="logout"
                size="lg"
                onClick={handleLogout}
                disabled={!canLogout}
                className="min-w-32 w-full sm:w-auto"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>

            {/* Today's Progress */}
            {todayLog && (
              <div className="text-center p-4 rounded-lg bg-gradient-to-r from-accent/30 to-secondary/30">
                <p className="text-sm text-muted-foreground mb-2">Today's Duration</p>
                <p className="text-2xl font-bold text-primary">
                  {todayLog.duration || 'In Progress...'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Time Logs History */}
        <Card className="shadow-large">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Time Logs History
            </CardTitle>
            <CardDescription>
              Your complete work time records - Click on any entry to edit
            </CardDescription>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Timer className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No time logs yet. Start by logging in!</p>
              </div>
            ) : (
              <div className="space-y-3">
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