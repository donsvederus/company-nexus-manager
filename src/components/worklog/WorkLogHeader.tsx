
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Save, Clock } from "lucide-react";
import { Client } from "@/types/client";

interface WorkLogHeaderProps {
  client: Client;
  onSave: () => void;
}

export function WorkLogHeader({ client, onSave }: WorkLogHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Work Log: {client.companyName}</h1>
        <p className="text-sm text-muted-foreground flex items-center mt-1">
          <Clock className="h-3 w-3 mr-1" /> Auto-saving enabled
        </p>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={() => navigate(`/clients/${client.id}`)}>
          Back to Client
        </Button>
        <Button onClick={onSave} className="flex items-center gap-1">
          <Save className="h-4 w-4" />
          Save Now
        </Button>
      </div>
    </div>
  );
}

export default WorkLogHeader;
