import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClients } from "@/context/ClientContext";
import { useAuth } from "@/context/AuthContext";
import { Client, ClientStatus, ClientFormData } from "@/types/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/StatusBadge";
import { Edit, Globe, Save } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import ClientServiceList from "@/components/ClientServiceList";

export default function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById, updateClientStatus, deleteClient, updateClient } = useClients();
  const { users } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBasicEditing, setIsBasicEditing] = useState(false);
  const [isContactEditing, setIsContactEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<Partial<Client>>({});
  
  // Get account managers from users
  const accountManagers = Array.isArray(users) 
    ? users.filter(user => user.role === "admin" || user.role === "manager") 
    : [];

  useEffect(() => {
    if (id) {
      const foundClient = getClientById(id);
      if (foundClient) {
        setClient(foundClient);
        
        // Check if the client's account manager is in the valid list
        const isValidManager = accountManagers.length > 0 && accountManagers.some(
          manager => manager.name === foundClient.accountManager
        );
        
        // If not, update the client with a valid account manager
        if (!isValidManager && accountManagers.length > 0) {
          const updatedClient = {
            ...foundClient,
            accountManager: accountManagers[0].name
          };
          updateClient(updatedClient);
          setClient(updatedClient);
          toast.info("Client's account manager was updated to a valid manager");
        }
        
        setEditedClient(foundClient); 
      } else {
        toast.error("Client not found");
        navigate("/clients");
      }
    }
  }, [id, getClientById, navigate, accountManagers, updateClient]);

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Loading client details...</p>
        </div>
      </div>
    );
  }

  const handleStatusChange = (newStatus: ClientStatus) => {
    if (client) {
      updateClientStatus(client.id, newStatus);
      setClient({ ...client, status: newStatus });
    }
  };

  const handleDelete = () => {
    if (client) {
      deleteClient(client.id);
      toast.success("Client deleted successfully");
      navigate("/clients");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedClient(prev => ({ ...prev, [field]: value }));
  };

  const saveBasicInfo = () => {
    if (client && editedClient) {
      const updatedClient = {
        ...client,
        companyName: editedClient.companyName || client.companyName,
        address: editedClient.address || client.address,
        startDate: editedClient.startDate || client.startDate,
        website: editedClient.website
      };
      updateClient(updatedClient);
      setClient(updatedClient);
      setIsBasicEditing(false);
      toast.success("Basic information updated successfully");
    }
  };

  const saveContactInfo = () => {
    if (client && editedClient) {
      const updatedClient = {
        ...client,
        accountManager: editedClient.accountManager || client.accountManager,
        mainContact: editedClient.mainContact || client.mainContact,
        email: editedClient.email || client.email,
        phone: editedClient.phone || client.phone
      };
      updateClient(updatedClient);
      setClient(updatedClient);
      setIsContactEditing(false);
      toast.success("Contact information updated successfully");
    }
  };

  // Function to set editing state and ensure editedClient has current values
  const startContactEditing = () => {
    if (client) {
      // Ensure the editedClient has the current client values before entering edit mode
      setEditedClient(current => ({
        ...current,
        accountManager: client.accountManager,
        mainContact: client.mainContact,
        email: client.email,
        phone: client.phone
      }));
    }
    setIsContactEditing(true);
  };

  // Function to set basic editing state and ensure editedClient has current values
  const startBasicEditing = () => {
    if (client) {
      // Ensure the editedClient has the current client values before entering edit mode
      setEditedClient(current => ({
        ...current,
        companyName: client.companyName,
        address: client.address,
        startDate: client.startDate,
        website: client.website
      }));
    }
    setIsBasicEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{client?.companyName}</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate("/clients")}>
            Back to List
          </Button>
          <Button variant="outline" asChild>
            <a href={`/clients/${id}/edit`}>Edit Client</a>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Client</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the client
                  record from your system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>Detailed information about {client?.companyName}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-muted-foreground">Basic Information</h3>
                  {isBasicEditing ? (
                    <Button size="sm" variant="ghost" onClick={saveBasicInfo} className="flex items-center gap-1">
                      <Save className="h-4 w-4" /> Save
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={startBasicEditing} className="flex items-center gap-1">
                      <Edit className="h-4 w-4" /> Edit
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {isBasicEditing ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Company Name:</span>
                        <Input 
                          value={editedClient.companyName || ''} 
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                          className="w-2/3 h-8 text-sm"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Website:</span>
                        <Input 
                          value={editedClient.website || ''} 
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          className="w-2/3 h-8 text-sm"
                          placeholder="example.com"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Address:</span>
                        <Input 
                          value={editedClient.address || ''} 
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="w-2/3 h-8 text-sm"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Start Date:</span>
                        <Input 
                          type="date"
                          value={new Date(editedClient.startDate || '').toISOString().split('T')[0]} 
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                          className="w-2/3 h-8 text-sm"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <InfoItem label="Company Name" value={client?.companyName || ''} />
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
                      <InfoItem label="Address" value={client?.address || ''} />
                      <InfoItem 
                        label="Start Date" 
                        value={client ? new Date(client.startDate).toLocaleDateString() : ''}
                      />
                      {client?.endDate && client.status === "inactive" && (
                        <InfoItem 
                          label="End Date" 
                          value={new Date(client.endDate).toLocaleDateString()}
                        />
                      )}
                    </>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <StatusBadge status={client?.status as ClientStatus} />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-muted-foreground">Contact Information</h3>
                  {isContactEditing ? (
                    <Button size="sm" variant="ghost" onClick={saveContactInfo} className="flex items-center gap-1">
                      <Save className="h-4 w-4" /> Save
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={startContactEditing} className="flex items-center gap-1">
                      <Edit className="h-4 w-4" /> Edit
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {isContactEditing ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Account Manager:</span>
                        {accountManagers && accountManagers.length > 0 ? (
                          <Select 
                            defaultValue={editedClient.accountManager || client?.accountManager}
                            onValueChange={(value) => handleInputChange('accountManager', value)}
                          >
                            <SelectTrigger className="w-2/3 h-8 text-sm">
                              <SelectValue placeholder="Select account manager">
                                {editedClient.accountManager || client?.accountManager}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {accountManagers.map((manager) => (
                                <SelectItem key={manager.id} value={manager.name}>
                                  {manager.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input 
                            value={editedClient.accountManager || ''} 
                            onChange={(e) => handleInputChange('accountManager', e.target.value)}
                            className="w-2/3 h-8 text-sm"
                          />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Main Contact:</span>
                        <Input 
                          value={editedClient.mainContact || ''} 
                          onChange={(e) => handleInputChange('mainContact', e.target.value)}
                          className="w-2/3 h-8 text-sm"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Email:</span>
                        <Input 
                          value={editedClient.email || ''} 
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-2/3 h-8 text-sm"
                          type="email"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Phone:</span>
                        <Input 
                          value={editedClient.phone || ''} 
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-2/3 h-8 text-sm"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <InfoItem label="Account Manager" value={client?.accountManager || ''} />
                      <InfoItem label="Main Contact" value={client?.mainContact || ''} />
                      <InfoItem label="Email" value={client?.email || ''} />
                      <InfoItem label="Phone" value={client?.phone || ''} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Current status:</p>
                <StatusBadge status={client?.status as ClientStatus} />
              </div>
              <div className="space-y-3 pt-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => client && handleStatusChange("active")}
                        disabled={client?.status === "active"}
                      >
                        Set as Active
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mark this client as currently active</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        className="w-full bg-red-600 hover:bg-red-700" 
                        onClick={() => client && handleStatusChange("inactive")}
                        disabled={client?.status === "inactive"}
                      >
                        Set as Inactive
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mark this client as inactive. Limited functionality will be available.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {client && <ClientServiceList client={client} />}
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}:</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
