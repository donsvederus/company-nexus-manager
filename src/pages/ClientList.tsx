
import { useState, useEffect } from "react";
import { useClients } from "@/context/ClientContext";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { ClientStatus } from "@/types/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, User, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function ClientList() {
  const { clients, updateLastContactDate } = useClients();
  const { user, hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [showOnlyMyClients, setShowOnlyMyClients] = useState(false);
  const [filteredClients, setFilteredClients] = useState(clients);
  
  // Apply filters whenever search term, status filter, or clients change
  useEffect(() => {
    let filtered = [...clients];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (client) =>
          client.companyName.toLowerCase().includes(term) ||
          client.mainContact.toLowerCase().includes(term) ||
          client.accountManager.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((client) => client.status === statusFilter);
    }
    
    // Apply account manager filter
    if (showOnlyMyClients && user) {
      filtered = filtered.filter((client) => client.accountManager === user.name);
    }

    // Sort by company name
    filtered = filtered.sort((a, b) => 
      a.companyName.localeCompare(b.companyName)
    );

    setFilteredClients(filtered);
  }, [searchTerm, statusFilter, showOnlyMyClients, clients, user]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const handleLastContactUpdate = (clientId: string, date?: Date) => {
    updateLastContactDate(clientId, date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Client List</h1>
        <Button className="bg-brand-600 hover:bg-brand-700" asChild>
          <Link to="/clients/new">Add New Client</Link>
        </Button>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="w-full sm:w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {!hasRole("admin") && (
            <Button
              variant={showOnlyMyClients ? "default" : "outline"}
              onClick={() => setShowOnlyMyClients(!showOnlyMyClients)}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              {showOnlyMyClients ? "All Clients" : "My Clients"}
            </Button>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Account Manager</TableHead>
                <TableHead>Main Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="whitespace-nowrap">Phone</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <Link to={`/clients/${client.id}`} className="text-brand-600 hover:underline">
                        {client.companyName}
                      </Link>
                    </TableCell>
                    <TableCell>{client.accountManager}</TableCell>
                    <TableCell>{client.mainContact}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell className="whitespace-nowrap">{client.phone}</TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="flex items-center gap-2 text-brand-600 hover:text-brand-700 p-0 h-auto"
                          >
                            <CalendarIcon className="h-4 w-4" />
                            {formatDate(client.lastContactDate)}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={client.lastContactDate ? new Date(client.lastContactDate) : undefined}
                            onSelect={(date) => handleLastContactUpdate(client.id, date)}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={client.status as ClientStatus} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No clients found. Try adjusting your filters or add a new client.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
