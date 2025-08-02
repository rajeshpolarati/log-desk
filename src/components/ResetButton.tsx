import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { premiumToast } from '@/lib/toast';

interface ResetButtonProps {
  onReset: () => void;
}

export const ResetButton = ({ onReset }: ResetButtonProps) => {
  const handleReset = () => {
    const confirmed = window.confirm(
      "Are you absolutely sure? This action cannot be undone. This will permanently delete all your time logs and reset the application to its initial state."
    );
    
    if (confirmed) {
      onReset();
      premiumToast.dataReset();
    }
  };

  return (
    <button 
      className="btn-destructive-premium text-sm px-4 py-2"
      onClick={handleReset}
    >
      <div className="flex items-center justify-center gap-2">
        <Trash2 className="w-4 h-4" />
        <span>Reset All Data</span>
      </div>
    </button>
  );
};