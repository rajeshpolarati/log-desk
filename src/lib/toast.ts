import { toast } from 'sonner';

// Premium toast utilities with consistent styling
export const premiumToast = {
  // Success notifications
  success: (message: string, title?: string) => {
    toast.success(message, {
      description: title,
      duration: 4000,
    });
  },

  // Error notifications
  error: (message: string, title?: string) => {
    toast.error(message, {
      description: title,
      duration: 5000,
    });
  },

  // Info notifications
  info: (message: string, title?: string) => {
    toast.info(message, {
      description: title,
      duration: 4000,
    });
  },

  // Warning notifications
  warning: (message: string, title?: string) => {
    toast.warning(message, {
      description: title,
      duration: 4000,
    });
  },

  // Login success
  loginSuccess: (time: string) => {
    toast.success(`Login time recorded: ${time}`, {
      description: "You're now tracking your work session",
      duration: 3000,
    });
  },

  // Logout success
  logoutSuccess: (time: string) => {
    toast.success(`Logout time recorded: ${time}`, {
      description: "Work session completed successfully",
      duration: 3000,
    });
  },

  // Data reset
  dataReset: () => {
    toast.success("All time logs have been cleared successfully.", {
      description: "Application reset to initial state",
      duration: 4000,
    });
  },

  // Time update
  timeUpdated: () => {
    toast.success("Log entry has been updated successfully.", {
      description: "Your time log has been modified",
      duration: 3000,
    });
  },

  // Validation errors
  invalidTimeFormat: () => {
    toast.error("Invalid Time Format", {
      description: "Please use format like '9:00 AM' or '5:30 PM'",
      duration: 5000,
    });
  },

  invalidDate: () => {
    toast.error("Invalid Date", {
      description: "Log date is invalid or outside acceptable range",
      duration: 5000,
    });
  },

  dataIntegrityWarning: () => {
    toast.error("Data Integrity Warning", {
      description: "Some data may have been corrupted. Please verify your time logs.",
      duration: 6000,
    });
  },

  saveError: () => {
    toast.error("Save Error", {
      description: "Failed to save time logs. Please try again.",
      duration: 5000,
    });
  },
}; 