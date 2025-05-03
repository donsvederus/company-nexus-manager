
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useClients } from "@/context/ClientContext"; // Add clients context
import { User, UserRole } from "@/types/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserPlus, Edit, Trash, Users } from "lucide-react";

// Make sure all fields are required to match the User interface
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
  const { clients, updateClient } = useClients(); // Get client functions
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
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      role: "manager",
    },
  });
  
  const onSubmit = (data: UserFormValues) => {
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
    form.reset();
  };
  
  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      username: user.username,
      password: user.password,
      role: user.role,
    });
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
    form.reset({
      name: "",
      email: "",
      username: "",
      password: "",
      role: "manager",
    });
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingUser ? "Edit Manager" : "Add New Manager"}</DialogTitle>
                <DialogDescription>
                  {editingUser
                    ? "Update the account manager details below."
                    : "Add a new account manager to assign to clients."}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingUser ? "Update Manager" : "Add Manager"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {managers.length > 0 ? (
                managers.map((manager) => (
                  <TableRow key={manager.id}>
                    <TableCell className="font-medium">{manager.name}</TableCell>
                    <TableCell>{manager.email}</TableCell>
                    <TableCell>{manager.username}</TableCell>
                    <TableCell className="capitalize">{manager.role}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(manager)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(manager)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No account managers found. Add one to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Reassign Clients Dialog */}
      <AlertDialog open={isReassignOpen} onOpenChange={setIsReassignOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reassign Clients</AlertDialogTitle>
            <AlertDialogDescription>
              {managerToDelete?.name} is currently managing {managerClients} client{managerClients !== 1 ? 's' : ''}. 
              You must reassign these clients to another manager before deleting this account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <FormItem>
              <FormLabel>Reassign to:</FormLabel>
              <Select onValueChange={setReassignTo} value={reassignTo}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a manager" />
                </SelectTrigger>
                <SelectContent>
                  {managers
                    .filter(m => m.id !== managerToDelete?.id) // Exclude the manager being deleted
                    .map(manager => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name} ({manager.role})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormItem>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsReassignOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReassignClients} 
              disabled={!reassignTo}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Reassign and Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
