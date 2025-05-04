
import { useState, useEffect } from "react";
import { useServices } from "@/context/services";
import { useClients } from "@/context/ClientContext";
import { Client } from "@/types/client";
import { Service } from "@/types/service";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Receipt, FileText, Save, Printer, FilePlus } from "lucide-react";
import { formatCurrency } from "@/utils/formatUtils";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function Invoices() {
  const { services, clientServices, getClientServices } = useServices();
  const { getClientById, clients } = useClients();
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<{
    id: string;
    serviceId: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState<string>(`INV-${new Date().getFullYear()}-${String(Date.now()).substring(7)}`);
  const [invoiceDate, setInvoiceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30); // 30 days from now
    return date.toISOString().split('T')[0];
  });
  const [hasLoadedServices, setHasLoadedServices] = useState(false);

  // Load client data when selected
  useEffect(() => {
    if (selectedClientId) {
      const client = getClientById(selectedClientId);
      setSelectedClient(client || null);
      
      // If we have a client, initialize invoice with their services
      if (client) {
        // Get ALL client services, not just active ones
        const clientServiceData = clientServices.filter(cs => cs.clientId === client.id);
        
        // Map client services to invoice items
        const items = clientServiceData.map(cs => {
          const serviceDetails = services.find(s => s.id === cs.serviceId);
          return {
            id: cs.id,
            serviceId: cs.serviceId,
            description: serviceDetails?.name || "Unknown Service",
            quantity: 1,
            unitPrice: cs.customCost || serviceDetails?.defaultCost || 0
          };
        });
        
        setInvoiceItems(items);
        setHasLoadedServices(true);
      }
    }
  }, [selectedClientId, getClientById, clientServices, services]);

  // Check if Acme Corporation is available and preselect it
  useEffect(() => {
    if (clients.length > 0 && !selectedClientId) {
      const acmeClient = clients.find(client => 
        client.companyName.toLowerCase().includes("acme")
      );
      
      if (acmeClient) {
        setSelectedClientId(acmeClient.id);
      }
    }
  }, [clients, selectedClientId]);

  const addEmptyItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      {
        id: Date.now().toString(),
        serviceId: "",
        description: "",
        quantity: 1,
        unitPrice: 0
      }
    ]);
  };

  const removeItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: string, value: string | number) => {
    setInvoiceItems(
      invoiceItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleServiceSelect = (id: string, serviceId: string) => {
    const selectedService = services.find(s => s.id === serviceId);
    if (selectedService) {
      updateItem(id, 'serviceId', serviceId);
      updateItem(id, 'description', selectedService.name);
      updateItem(id, 'unitPrice', selectedService.defaultCost);
    }
  };

  const calculateSubtotal = () => {
    return invoiceItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const saveInvoice = () => {
    // Here you would implement saving the invoice data
    console.log({
      invoiceNumber,
      invoiceDate,
      dueDate,
      client: selectedClient,
      items: invoiceItems,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal()
    });
    
    toast.success("Invoice saved successfully");
  };

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl print:max-w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Create and manage your invoices</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={saveInvoice}>
            <Save className="mr-2 h-4 w-4" />
            Save Invoice
          </Button>
          <Button onClick={printInvoice}>
            <Printer className="mr-2 h-4 w-4" />
            Print Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 print:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium" htmlFor="invoiceNumber">Invoice Number</label>
                  <Input 
                    id="invoiceNumber"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium" htmlFor="invoiceDate">Invoice Date</label>
                  <Input 
                    id="invoiceDate"
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium" htmlFor="dueDate">Due Date</label>
                  <Input 
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium" htmlFor="clientSelect">Select Client</label>
                <Select 
                  value={selectedClientId} 
                  onValueChange={setSelectedClientId}
                >
                  <SelectTrigger id="clientSelect" className="mt-1">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedClient && (
                <div className="border p-4 rounded-md bg-muted/50">
                  <h3 className="font-medium">{selectedClient.companyName}</h3>
                  <p className="text-sm">{selectedClient.mainContact}</p>
                  <p className="text-sm">{selectedClient.email}</p>
                  <p className="text-sm">{selectedClient.phone}</p>
                  <p className="text-sm">
                    {selectedClient.street}, {selectedClient.city}, {selectedClient.state} {selectedClient.zipCode}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedClient && hasLoadedServices && invoiceItems.length === 0 && (
        <Alert className="mt-6" variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No services found for {selectedClient.companyName}. Please add services for this client.
          </AlertDescription>
        </Alert>
      )}

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invoice Items</CardTitle>
          <Button 
            variant="outline"
            className="print:hidden"
            onClick={addEmptyItem}
          >
            <FilePlus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="w-[50px] print:hidden"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceItems.length > 0 ? (
                  invoiceItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Select 
                          value={item.serviceId} 
                          onValueChange={(value) => handleServiceSelect(item.id, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select service" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value, 10) || 1)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        />
                      </TableCell>
                      <TableCell>
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </TableCell>
                      <TableCell className="print:hidden">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          &times;
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No items added. Click "Add Item" to add invoice items.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 flex justify-end print:pr-8">
            <div className="w-[300px] space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span>{formatCurrency(calculateTax())}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-medium">
                <span>Total:</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
