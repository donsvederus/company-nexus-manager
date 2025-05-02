
import { useState, useEffect } from "react";
import { useClients } from "@/context/ClientContext";
import { useAuth } from "@/context/AuthContext";
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
import { Search, Filter, User } from "lucide-react";

export default function ClientList() {
  const { clients } = useClients();
  const { user, hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
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

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setShowOnlyMyClients(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Client List</h1>
        <Button className="bg-brand-600 hover:bg-brand-700" asChild>
          <a href="/clients/new">Add New Client</a>
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
          {(searchTerm || statusFilter !== "all" || showOnlyMyClients) && (
            <Button variant="outline" onClick={handleResetFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Reset Filters
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
                <TableHead>Phone</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <a href={`/clients/${client.id}`} className="text-brand-600 hover:underline">
                        {client.companyName}
                      </a>
                    </TableCell>
                    <TableCell>{client.accountManager}</TableCell>
                    <TableCell>{client.mainContact}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>{new Date(client.startDate).toLocaleDateString()}</TableCell>
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
