
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface InvoiceInfoCardProps {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  setInvoiceNumber: (value: string) => void;
  setInvoiceDate: (value: string) => void;
  setDueDate: (value: string) => void;
}

export function InvoiceInfoCard({
  invoiceNumber,
  invoiceDate,
  dueDate,
  setInvoiceNumber,
  setInvoiceDate,
  setDueDate,
}: InvoiceInfoCardProps) {
  return (
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
  );
}
