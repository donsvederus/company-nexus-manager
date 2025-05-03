
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";
import { Client } from "@/types/client";
import { toast } from "sonner";
import { useClients } from "@/context/client";
import { BasicInfoDisplay } from "./info/BasicInfoDisplay";
import { BasicInfoEditForm } from "./form/BasicInfoEditForm";

interface BasicInfoCardProps {
  client: Client;
  onClientUpdate: (updatedClient: Client) => void;
}

export default function BasicInfoCard({ client, onClientUpdate }: BasicInfoCardProps) {
  const { updateClient } = useClients();
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    companyName: client.companyName,
    street: client.street || '',
    city: client.city || '',
    state: client.state || '',
    zipCode: client.zipCode || '',
    startDate: client.startDate,
    website: client.website || ''
  });

  // Update local state when client prop changes
  useEffect(() => {
    setEditedInfo({
      companyName: client.companyName,
      street: client.street || '',
      city: client.city || '',
      state: client.state || '',
      zipCode: client.zipCode || '',
      startDate: client.startDate,
      website: client.website || ''
    });
  }, [client]);

  const handleInputChange = (field: string, value: string) => {
    console.log(`Updating field ${field} with value: ${value}`);
    setEditedInfo(prev => ({ ...prev, [field]: value }));
  };

  const saveBasicInfo = () => {
    const updatedClient = {
      ...client,
      companyName: editedInfo.companyName || client.companyName,
      street: editedInfo.street,
      city: editedInfo.city,
      state: editedInfo.state,
      zipCode: editedInfo.zipCode,
      startDate: editedInfo.startDate || client.startDate,
      website: editedInfo.website !== undefined ? editedInfo.website : client.website
    };
    
    console.log("Saving basic info:", updatedClient);
    updateClient(updatedClient);
    onClientUpdate(updatedClient);
    setIsEditing(false);
    toast.success("Basic information updated successfully");
  };

  const startEditing = () => {
    setEditedInfo({
      companyName: client.companyName,
      street: client.street || '',
      city: client.city || '',
      state: client.state || '',
      zipCode: client.zipCode || '',
      startDate: client.startDate,
      website: client.website || ''
    });
    setIsEditing(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-muted-foreground">Basic Information</h3>
        {isEditing ? (
          <Button size="sm" variant="ghost" onClick={saveBasicInfo} className="flex items-center gap-1">
            <Save className="h-4 w-4" /> Save
          </Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={startEditing} className="flex items-center gap-1">
            <Edit className="h-4 w-4" /> Edit
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <BasicInfoEditForm editedInfo={editedInfo} handleInputChange={handleInputChange} />
      ) : (
        <BasicInfoDisplay client={client} />
      )}
    </div>
  );
}
