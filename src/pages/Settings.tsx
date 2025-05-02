import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useClients } from "@/context/ClientContext";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { SettingsIcon, Upload, Plus, Trash, Edit } from "lucide-react";
import { Navigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/types/auth";

// Company Settings Schema
const companyFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  website: z.string().optional(),
  address: z.string().min(1, "Address is required")
});

// Account Manager Schema
const accountManagerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "manager"])
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;
type AccountManagerFormValues = z.infer<typeof accountManagerSchema>;

interface AccountManager {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  role: UserRole;
}

// Our mock data for initial settings
const defaultSettings = {
  companyName: "ClientNexus Solutions",
  email: "info@clientnexus.com",
  phone: "(555) 123-4567",
  website: "www.clientnexus.com",
  address: "123 Business Way, Enterprise City, CA 90210",
  logo: ""
};

// Sample account managers
const initialAccountManagers: AccountManager[] = [
  {
    id: "1",
    name: "Jane Smith",
    email: "jane.smith@clientnexus.com",
    phone: "(555) 111-2222",
    username: "janesmith",
    password: "password123",
    role: "manager"
  },
  {
    id: "2",
    name: "Michael Johnson",
    email: "michael.johnson@clientnexus.com",
    phone: "(555) 222-3333",
    username: "michaelj",
    password: "password123",
    role: "manager"
  },
  {
    id: "3",
    name: "Bruce Wayne",
    email: "bruce.wayne@clientnexus.com",
    phone: "(555) 333-4444",
    username: "brucewayne",
    password: "password123",
    role: "manager"
  },
  {
    id: "4",
    name: "Admin User",
    email: "admin@clientnexus.com",
    phone: "(555) 000-0000",
    username: "admin",
    password: "admin123",
    role: "admin"
  }
];

const SettingsPage = () => {
  const { hasRole, user } = useAuth();
  const { clients, updateClient } = useClients();
  const [companySettings, setCompanySettings] = useState(defaultSettings);
  const [accountManagers, setAccountManagers] = useState<AccountManager[]>(initialAccountManagers);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [editingManager, setEditingManager] = useState<AccountManager | null>(null);
  const [managerToDelete, setManagerToDelete] = useState<AccountManager | null>(null);
  const [replacementManagerId, setReplacementManagerId] = useState<string>("");
  const [isReassignDialogOpen, setIsReassignDialogOpen] = useState(false);

  // If the user doesn't have admin role, redirect to dashboard
  if (!hasRole("admin")) {
    return <Navigate to="/" />;
  }
  
  // Setup company form
  const companyForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: companySettings
  });

  // Setup account manager form
  const managerForm = useForm<AccountManagerFormValues>({
    resolver: zodResolver(accountManagerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      role: "manager"
    }
  });

  // Handle logo upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast.success("Logo uploaded successfully");
    }
  };

  // Save company settings
  const onSaveCompanySettings = (data: CompanyFormValues) => {
    setCompanySettings({
      ...companySettings,
      ...data
    });
    toast.success("Company settings updated successfully");
  };

  // Add or update account manager
  const onSaveAccountManager = (data: AccountManagerFormValues) => {
    if (editingManager) {
      // Update existing manager
      setAccountManagers(prevManagers => 
        prevManagers.map(manager => 
          manager.id === editingManager.id 
            ? { ...manager, name: data.name, email: data.email, phone: data.phone, username: data.username, password: data.password, role: data.role } 
            : manager
        )
      );
      setEditingManager(null);
      toast.success("Account manager updated successfully");
    } else {
      // Add new manager
      const newManager: AccountManager = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        username: data.username,
        password: data.password,
        role: data.role
      };
      setAccountManagers([...accountManagers, newManager]);
      toast.success("Account manager added successfully");
    }
    managerForm.reset({
      name: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      role: "manager"
    });
  };

  // Delete account manager
  const confirmDeleteManager = (manager: AccountManager) => {
    setManagerToDelete(manager);
    setReplacementManagerId("");
    setIsReassignDialogOpen(true);
  };

  // Execute delete with reassignment
  const executeDelete = () => {
    if (!managerToDelete || !replacementManagerId) {
      toast.error("Please select a replacement manager");
      return;
    }

    // Get the replacement manager
    const replacement = accountManagers.find(m => m.id === replacementManagerId);
    if (!replacement) {
      toast.error("Invalid replacement manager");
      return;
    }

    // Update all clients with the deleted manager to use the new one
    clients.forEach(client => {
      if (client.accountManager === managerToDelete.name) {
        updateClient({
          ...client,
          accountManager: replacement.name
        });
      }
    });
    
    // Remove the manager from the list
    setAccountManagers(accountManagers.filter(manager => manager.id !== managerToDelete.id));
    
    toast.success(`Manager ${managerToDelete.name} deleted and clients reassigned to ${replacement.name}`);
    setIsReassignDialogOpen(false);
    setManagerToDelete(null);
  };

  // Edit account manager
  const editManager = (manager: AccountManager) => {
    setEditingManager(manager);
    managerForm.reset({
      name: manager.name,
      email: manager.email,
      phone: manager.phone,
      username: manager.username,
      password: manager.password,
      role: manager.role
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingManager(null);
    managerForm.reset({
      name: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      role: "manager"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application settings and preferences.
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="company">Company Settings</TabsTrigger>
          <TabsTrigger value="managers">Account Managers</TabsTrigger>
        </TabsList>
        
        {/* Company Settings Tab */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your company details and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Company Logo</h3>
                <div className="flex items-center gap-6">
                  <div className="flex items-center justify-center w-24 h-24 rounded-md border overflow-hidden bg-muted">
                    {logoPreview ? (
                      <img 
                        src={logoPreview} 
                        alt="Company logo preview" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <SettingsIcon className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Button variant="outline" className="w-full" asChild>
                      <label>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Logo
                        <input 
                          type="file" 
                          className="sr-only" 
                          accept="image/*" 
                          onChange={handleLogoChange}
                        />
                      </label>
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Recommended: Square image, at least 128×128px
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Company Information Form */}
              <Form {...companyForm}>
                <form onSubmit={companyForm.handleSubmit(onSaveCompanySettings)} className="space-y-4">
                  <FormField
                    control={companyForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={companyForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="company@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={companyForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={companyForm.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="www.example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={companyForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Business St, City, State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit">Save Changes</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Account Managers Tab */}
        <TabsContent value="managers">
          <Card>
            <CardHeader>
              <CardTitle>Account Managers</CardTitle>
              <CardDescription>
                Add and manage account managers who handle client relationships
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Account Manager Form */}
              <Form {...managerForm}>
                <form onSubmit={managerForm.handleSubmit(onSaveAccountManager)} className="space-y-4">
                  {/* Rearranged Name and Email fields to be side by side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={managerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Full Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={managerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={managerForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={managerForm.control}
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
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={managerForm.control}
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
                    
                    <FormField
                      control={managerForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select 
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingManager ? (
                        <>Update Manager</>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Manager
                        </>
                      )}
                    </Button>
                    
                    {editingManager && (
                      <Button type="button" variant="outline" onClick={cancelEditing}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
              
              {/* Account Managers List */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Manager</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accountManagers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No account managers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      accountManagers.map((manager) => (
                        <TableRow key={manager.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {manager.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {manager.name}
                            </div>
                          </TableCell>
                          <TableCell>{manager.email}</TableCell>
                          <TableCell>{manager.username}</TableCell>
                          <TableCell>
                            <span className={manager.role === "admin" ? "text-blue-600 font-medium" : ""}>
                              {manager.role.charAt(0).toUpperCase() + manager.role.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => editManager(manager)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => confirmDeleteManager(manager)}
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Reassign Manager Dialog */}
      <Dialog open={isReassignDialogOpen} onOpenChange={setIsReassignDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reassign Clients</DialogTitle>
            <DialogDescription>
              Before deleting this manager, please select a new manager to handle their clients.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Deleting:</p>
              <div className="flex items-center gap-2 p-2 border rounded-md">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-destructive/10 text-destructive">
                    {managerToDelete?.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{managerToDelete?.name}</p>
                  <p className="text-xs text-muted-foreground">{managerToDelete?.email}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Assign clients to:</p>
              <Select value={replacementManagerId} onValueChange={setReplacementManagerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a manager" />
                </SelectTrigger>
                <SelectContent>
                  {accountManagers
                    .filter(m => m.id !== managerToDelete?.id)
                    .map(manager => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReassignDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={executeDelete} 
              disabled={!replacementManagerId}
            >
              Delete & Reassign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
