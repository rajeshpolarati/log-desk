import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
      toast.success("All time logs have been cleared successfully.");
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="text-destructive hover:text-destructive"
      onClick={handleReset}
    >
      <Trash2 className="w-4 h-4 mr-2" />
      Reset All Data
    </Button>
  );
};