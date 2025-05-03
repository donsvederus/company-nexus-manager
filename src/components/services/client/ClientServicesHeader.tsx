
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { Client } from "@/types/client";

interface ClientServicesHeaderProps {
  client: Client;
  onSaveChanges: () => void;
}

export const ClientServicesHeader = ({ client, onSaveChanges }: ClientServicesHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight">Services: {client.companyName}</h1>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          onClick={() => navigate("/services")}
          className="flex items-center gap-1"
        >
          <Settings className="h-4 w-4" />
          Manage Service Types
        </Button>
        <Button variant="outline" onClick={() => navigate(`/clients/${client.id}`)}>
          Back to Client
        </Button>
        <Button onClick={onSaveChanges}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};
