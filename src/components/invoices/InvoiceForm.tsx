
import { useState, useEffect } from "react";
import { useServices } from "@/context/services";
import { useClients } from "@/context/client";
import { Client } from "@/types/client";
import { Service } from "@/types/service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceInfoCard } from "./InvoiceInfoCard";
import { ClientInfoCard } from "./ClientInfoCard";
import { InvoiceItemsTable } from "./InvoiceItemsTable";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/formatUtils";

export interface InvoiceItem {
  id: string;
  serviceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function InvoiceForm() {
  const { services, clientServices, getServiceDetails } = useServices();
  const { getClientById, clients } = useClients();
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
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
        // Get client services for this specific client
        const clientServiceData = clientServices.filter(cs => cs.clientId === client.id);
        
        if (clientServiceData.length > 0) {
          // Map client services to invoice items
          const items = clientServiceData.map(cs => {
            const serviceDetails = getServiceDetails(cs.serviceId);
            return {
              id: cs.id,
              serviceId: cs.serviceId,
              description: serviceDetails?.name || "Unknown Service",
              quantity: 1,
              unitPrice: cs.customCost || (serviceDetails?.defaultCost || 0)
            };
          });
          
          setInvoiceItems(items);
        } else {
          // If no services found for this client, set empty array
          setInvoiceItems([]);
        }
        
        setHasLoadedServices(true);
      }
    }
  }, [selectedClientId, getClientById, clientServices, getServiceDetails]);

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
    // Find the service from all available services
    const selectedService = services.find(s => s.id === serviceId);
    
    // Find if there's a client service with a custom cost for this service
    const clientService = clientServices.find(
      cs => cs.serviceId === serviceId && cs.clientId === selectedClientId
    );
    
    if (selectedService) {
      updateItem(id, 'serviceId', serviceId);
      updateItem(id, 'description', selectedService.name);
      // Use custom cost if available, otherwise use default cost
      const price = clientService?.customCost ?? selectedService.defaultCost;
      updateItem(id, 'unitPrice', price);
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
      <InvoiceHeader 
        saveInvoice={saveInvoice}
        printInvoice={printInvoice}
      />

      <div className="grid gap-6 md:grid-cols-2 print:grid-cols-2">
        <InvoiceInfoCard
          invoiceNumber={invoiceNumber}
          invoiceDate={invoiceDate}
          dueDate={dueDate}
          setInvoiceNumber={setInvoiceNumber}
          setInvoiceDate={setInvoiceDate}
          setDueDate={setDueDate}
        />

        <ClientInfoCard
          clients={clients}
          selectedClientId={selectedClientId}
          selectedClient={selectedClient}
          onClientSelect={setSelectedClientId}
        />
      </div>

      {selectedClient && hasLoadedServices && invoiceItems.length === 0 && (
        <Alert className="mt-6" variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No services found for {selectedClient.companyName}. Please add services for this client.
          </AlertDescription>
        </Alert>
      )}

      <InvoiceItemsTable
        invoiceItems={invoiceItems}
        services={services}
        addEmptyItem={addEmptyItem}
        removeItem={removeItem}
        updateItem={updateItem}
        handleServiceSelect={handleServiceSelect}
        calculateSubtotal={calculateSubtotal}
        calculateTax={calculateTax}
        calculateTotal={calculateTotal}
      />
    </div>
  );
}
