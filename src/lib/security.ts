// Security utilities for data validation and sanitization

interface TimeLog {
  date: string;
  loginTime: string;
  logoutTime?: string;
  duration?: string;
}

// Data validation schema for TimeLog
const isValidTimeLog = (obj: any): obj is TimeLog => {
  if (!obj || typeof obj !== 'object') return false;
  
  // Required fields
  if (typeof obj.date !== 'string' || !obj.date.match(/^\d{4}-\d{2}-\d{2}$/)) return false;
  if (typeof obj.loginTime !== 'string' || !obj.loginTime.match(/^(0?[1-9]|1[0-2]):[0-5][0-9] [AP]M$/)) return false;
  
  // Optional fields validation
  if (obj.logoutTime !== undefined) {
    if (typeof obj.logoutTime !== 'string' || !obj.logoutTime.match(/^(0?[1-9]|1[0-2]):[0-5][0-9] [AP]M$/)) return false;
  }
  
  if (obj.duration !== undefined) {
    if (typeof obj.duration !== 'string' || !obj.duration.match(/^\d+h \d+m$/)) return false;
  }
  
  return true;
};

// Secure localStorage operations with validation
export const secureLocalStorage = {
  // Safely parse and validate localStorage data
  getTimeLogs: (): TimeLog[] => {
    try {
      const data = localStorage.getItem('timeLogs');
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      
      // Validate that it's an array
      if (!Array.isArray(parsed)) {
        console.warn('Invalid data structure in localStorage, resetting...');
        localStorage.removeItem('timeLogs');
        return [];
      }
      
      // Validate each item and filter out invalid entries
      const validLogs = parsed.filter((item: any) => {
        const isValid = isValidTimeLog(item);
        if (!isValid) {
          console.warn('Invalid time log entry detected and removed:', item);
        }
        return isValid;
      });
      
      // If some entries were invalid, save the cleaned data
      if (validLogs.length !== parsed.length) {
        localStorage.setItem('timeLogs', JSON.stringify(validLogs));
      }
      
      return validLogs;
    } catch (error) {
      console.error('Error parsing localStorage data:', error);
      localStorage.removeItem('timeLogs');
      return [];
    }
  },
  
  // Safely save time logs with validation
  setTimeLogs: (logs: TimeLog[]): boolean => {
    try {
      // Validate all logs before saving
      const validLogs = logs.filter(isValidTimeLog);
      
      if (validLogs.length !== logs.length) {
        console.warn('Some invalid logs were filtered out before saving');
      }
      
      localStorage.setItem('timeLogs', JSON.stringify(validLogs));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }
};

// Input sanitization utilities
export const sanitizeInput = {
  // Sanitize time input to prevent injection
  timeInput: (input: string): string => {
    // Remove any non-time characters and limit length
    return input.replace(/[^0-9:APM\s]/g, '').slice(0, 8);
  },
  
  // Validate date input
  dateInput: (input: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(input)) return false;
    
    const date = new Date(input);
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    
    // Check if date is valid and within reasonable bounds
    return date instanceof Date && !isNaN(date.getTime()) && 
           date >= oneYearAgo && date <= oneYearFromNow;
  },
  
  // Validate time format
  timeFormat: (input: string): boolean => {
    const timePattern = /^(0?[1-9]|1[0-2]):[0-5][0-9] [AP]M$/;
    return timePattern.test(input);
  }
};

// Data integrity checks
export const dataIntegrity = {
  // Generate a simple checksum for data validation
  generateChecksum: (data: TimeLog[]): string => {
    const dataString = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  },
  
  // Validate data integrity
  validateIntegrity: (data: TimeLog[]): boolean => {
    const storedChecksum = localStorage.getItem('timeLogs_checksum');
    const currentChecksum = dataIntegrity.generateChecksum(data);
    
    if (!storedChecksum) {
      localStorage.setItem('timeLogs_checksum', currentChecksum);
      return true;
    }
    
    return storedChecksum === currentChecksum;
  },
  
  // Update data integrity checksum
  updateChecksum: (data: TimeLog[]): void => {
    const checksum = dataIntegrity.generateChecksum(data);
    localStorage.setItem('timeLogs_checksum', checksum);
  }
};