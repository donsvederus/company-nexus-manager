import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Save, Globe } from "lucide-react";
import { Client } from "@/types/client";
import { toast } from "sonner";
import { useClients } from "@/context/ClientContext";

interface BasicInfoCardProps {
  client: Client;
  onClientUpdate: (updatedClient: Client) => void;
}

interface InfoItemProps {
  label: string;
  value: string;
}

// Regular info item component
function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}:</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

// Formatted address component that displays in the structured format
function FormattedAddress({ client }: { client: Client }) {
  // Check if we have the new address fields
  if (client.street !== undefined) {
    return (
      <div className="text-sm text-right">
        <div>{client.street}</div>
        <div>{client.city}</div>
        <div>{client.state}, {client.zipCode}</div>
      </div>
    );
  } 
  
  return <span className="text-sm text-muted-foreground">Not specified</span>;
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
    // Determine if we're using the new address fields or legacy address
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
      website: client.website || '' // Initialize website properly
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
      <div className="space-y-2">
        {isEditing ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Company:</span>
              <div className="w-2/3">
                <Input 
                  value={editedInfo.companyName || ''} 
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="h-8 text-sm w-full"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Website:</span>
              <div className="w-2/3">
                <Input 
                  value={editedInfo.website || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="h-8 text-sm w-full"
                  placeholder="example.com"
                />
              </div>
            </div>
            
            {/* Address fields */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Street:</span>
              <div className="w-2/3">
                <Input 
                  value={editedInfo.street || ''} 
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  className="h-8 text-sm w-full"
                  placeholder="123 Main St"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">City:</span>
              <div className="w-2/3">
                <Input 
                  value={editedInfo.city || ''} 
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="h-8 text-sm w-full"
                  placeholder="Anytown"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">State:</span>
                <div className="w-2/3">
                  <Input 
                    value={editedInfo.state || ''} 
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="h-8 text-sm w-full uppercase"
                    placeholder="CA"
                    maxLength={2}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ZIP:</span>
                <div className="w-2/3">
                  <Input 
                    value={editedInfo.zipCode || ''} 
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="h-8 text-sm w-full"
                    placeholder="12345"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Start Date:</span>
              <div className="w-2/3">
                <Input 
                  type="date"
                  value={new Date(editedInfo.startDate || '').toISOString().split('T')[0]} 
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="h-8 text-sm w-full"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <InfoItem label="Company" value={client?.companyName || ''} />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Website:</span>
              {client?.website ? (
                <div className="text-sm flex items-center">
                  <Globe className="h-3 w-3 mr-1 inline text-muted-foreground" />
                  <a 
                    href={`http://${client.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {client.website}
                  </a>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Not specified</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Address:</span>
              <FormattedAddress client={client} />
            </div>
            <InfoItem 
              label="Start Date" 
              value={new Date(client.startDate).toLocaleDateString()}
            />
            {client?.endDate && client.status === "inactive" && (
              <InfoItem 
                label="End Date" 
                value={new Date(client.endDate).toLocaleDateString()}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
