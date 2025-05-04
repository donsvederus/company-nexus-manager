
import { Button } from "@/components/ui/button";
import { Save, Printer } from "lucide-react";

interface InvoiceHeaderProps {
  saveInvoice: () => void;
  printInvoice: () => void;
}

export function InvoiceHeader({ saveInvoice, printInvoice }: InvoiceHeaderProps) {
  return (
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
  );
}
