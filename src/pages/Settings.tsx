
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useClients } from "@/context/ClientContext";
import { User } from "@/types/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { AccountManagerForm } from "@/components/settings/AccountManagerForm";
import { ManagersTable } from "@/components/settings/ManagersTable";
import { ReassignClientsDialog } from "@/components/settings/ReassignClientsDialog";
import { z } from "zod";

// Reuse the schema from the AccountManagerForm component
const userFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "manager"] as const),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export default function SettingsPage() {
  const { user, users, hasRole, updateAccountManagers } = useAuth();
  const { clients, updateClient } = useClients();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [managers, setManagers] = useState<User[]>([]);
  
  // State for reassignment dialog
  const [isReassignOpen, setIsReassignOpen] = useState(false); 
  const [managerToDelete, setManagerToDelete] = useState<User | null>(null);
  const [reassignTo, setReassignTo] = useState<string>("");
  const [managerClients, setManagerClients] = useState<number>(0);
  
  useEffect(() => {
    // Filter users to show only managers and admins
    setManagers(users.filter(u => u.role === "manager" || u.role === "admin"));
  }, [users]);
  
  const handleSubmit = (data: UserFormValues) => {
    // If editing an existing user
    if (editingUser) {
      const updatedManagers = managers.map((manager) => {
        if (manager.id === editingUser.id) {
          // Ensure all required fields are included
          return {
            id: manager.id,
            name: data.name,
            email: data.email,
            username: data.username,
            password: data.password,
            role: data.role,
          } as User;
        }
        return manager;
      });
      
      updateAccountManagers(updatedManagers);
      toast.success(`Account manager ${data.name} updated successfully`);
    } 
    // Adding a new user
    else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        username: data.username,
        password: data.password,
        role: data.role,
      };
      
      const updatedManagers = [...managers, newUser];
      updateAccountManagers(updatedManagers);
      toast.success(`Account manager ${data.name} added successfully`);
    }
    
    setIsDialogOpen(false);
    setEditingUser(null);
  };
  
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };
  
  const handleDelete = (manager: User) => {
    const managerName = manager.name;
    
    // Check if this manager has any assigned clients
    const managerHasClients = clients.some(client => client.accountManager === managerName);
    
    if (managerHasClients) {
      // Count how many clients are assigned to this manager
      const clientCount = clients.filter(client => client.accountManager === managerName).length;
      
      setManagerToDelete(manager);
      setManagerClients(clientCount);
      setReassignTo("");
      setIsReassignOpen(true);
    } else {
      // If no clients, delete directly
      const updatedManagers = managers.filter((m) => m.id !== manager.id);
      updateAccountManagers(updatedManagers);
      toast.success("Account manager removed successfully");
    }
  };
  
  const handleReassignClients = () => {
    if (!managerToDelete || !reassignTo) {
      toast.error("Please select a manager to reassign clients to");
      return;
    }
    
    // Find the new manager by id
    const newManager = managers.find(m => m.id === reassignTo);
    
    if (!newManager) {
      toast.error("Selected manager not found");
      return;
    }
    
    // Update all clients assigned to the deleted manager
    const updatedClients = clients.map(client => {
      if (client.accountManager === managerToDelete.name) {
        return { ...client, accountManager: newManager.name };
      }
      return client;
    });
    
    // Update each client individually
    updatedClients.forEach(client => {
      if (client.accountManager === newManager.name) {
        updateClient(client);
      }
    });
    
    // Now delete the manager
    const updatedManagers = managers.filter((m) => m.id !== managerToDelete.id);
    updateAccountManagers(updatedManagers);
    
    toast.success(`All clients reassigned to ${newManager.name} and ${managerToDelete.name} removed successfully`);
    setIsReassignOpen(false);
    setManagerToDelete(null);
  };
  
  const handleAddNew = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };
  
  // Only admins can access this page
  if (!hasRole("admin")) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                You don't have permission to access this page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Account Managers</CardTitle>
            <CardDescription>
              Manage account managers who can be assigned to clients
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Manager
              </Button>
            </DialogTrigger>
            <AccountManagerForm 
              editingUser={editingUser} 
              onSubmit={handleSubmit} 
              onCancel={() => setIsDialogOpen(false)} 
            />
          </Dialog>
        </CardHeader>
        <CardContent>
          <ManagersTable 
            managers={managers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
      
      {/* Reassign Clients Dialog */}
      <ReassignClientsDialog
        isOpen={isReassignOpen}
        onOpenChange={setIsReassignOpen}
        managerToDelete={managerToDelete}
        managers={managers}
        clientCount={managerClients}
        reassignTo={reassignTo}
        setReassignTo={setReassignTo}
        onConfirm={handleReassignClients}
      />
    </div>
  );
}
