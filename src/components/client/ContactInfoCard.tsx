import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Save } from "lucide-react";
import { Client } from "@/types/client";
import { toast } from "sonner";
import { useClients } from "@/context/ClientContext";
import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoItem } from "./info/InfoItem";

interface ContactInfoCardProps {
  client: Client;
  onClientUpdate: (updatedClient: Client) => void;
}

export default function ContactInfoCard({ client, onClientUpdate }: ContactInfoCardProps) {
  const { updateClient } = useClients();
  const { users, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    mainContact: client.mainContact,
    email: client.email,
    phone: client.phone,
    accountManager: client.accountManager
  });

  // Get account managers from users
  const accountManagers = Array.isArray(users) 
    ? users.filter(u => u.role === "admin" || u.role === "manager") 
    : [];

  // Check if current user is admin
  const isAdmin = user?.role === "admin";

  // Update local state when client prop changes
  useEffect(() => {
    setEditedInfo({
      mainContact: client.mainContact,
      email: client.email,
      phone: client.phone,
      accountManager: client.accountManager
    });
  }, [client]);

  const handleInputChange = (field: string, value: string) => {
    console.log(`Updating field ${field} with value: ${value}`);
    setEditedInfo(prev => ({ ...prev, [field]: value }));
  };

  const saveContactInfo = () => {
    const updatedClient = {
      ...client,
      mainContact: editedInfo.mainContact || client.mainContact,
      email: editedInfo.email || client.email,
      phone: editedInfo.phone || client.phone,
      accountManager: editedInfo.accountManager || client.accountManager
    };
    
    updateClient(updatedClient);
    onClientUpdate(updatedClient);
    setIsEditing(false);
    toast.success("Contact information updated successfully");
  };

  const startEditing = () => {
    setEditedInfo({
      mainContact: client.mainContact,
      email: client.email,
      phone: client.phone,
      accountManager: client.accountManager
    });
    setIsEditing(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-muted-foreground">Contact Information</h3>
        {isEditing ? (
          <Button size="sm" variant="ghost" onClick={saveContactInfo} className="flex items-center gap-1">
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
            {/* Account manager dropdown - only show to admin users */}
            {isAdmin && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Manager:</span>
                <div className="w-2/3">
                  <Select
                    value={editedInfo.accountManager}
                    onValueChange={(value) => handleInputChange('accountManager', value)}
                  >
                    <SelectTrigger className="h-8 text-sm w-full">
                      <SelectValue placeholder="Select a manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountManagers.map((manager) => (
                        <SelectItem key={manager.id} value={manager.name}>
                          {manager.name} ({manager.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            {/* Read-only manager field for non-admin users */}
            {!isAdmin && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Manager:</span>
                <span className="text-sm text-muted-foreground w-2/3 text-right">
                  {client.accountManager}
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Contact:</span>
              <div className="w-2/3">
                <Input 
                  value={editedInfo.mainContact || ''} 
                  onChange={(e) => handleInputChange('mainContact', e.target.value)}
                  className="h-8 text-sm w-full"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Email:</span>
              <div className="w-2/3">
                <Input 
                  value={editedInfo.email || ''} 
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="h-8 text-sm w-full"
                  type="email"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Phone:</span>
              <div className="w-2/3">
                <Input 
                  value={editedInfo.phone || ''} 
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="h-8 text-sm w-full"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <InfoItem label="Manager" value={client?.accountManager || ''} />
            <InfoItem label="Contact" value={client?.mainContact || ''} />
            <InfoItem label="Email" value={client?.email || ''} />
            <InfoItem label="Phone" value={client?.phone || ''} />
          </>
        )}
      </div>
    </div>
  );
}
