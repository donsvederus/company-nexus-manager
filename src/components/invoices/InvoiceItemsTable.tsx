
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Service } from "@/types/service";
import { FilePlus } from "lucide-react";
import { formatCurrency } from "@/utils/formatUtils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceItem } from "./InvoiceForm";

interface InvoiceItemsTableProps {
  invoiceItems: InvoiceItem[];
  services: Service[];
  addEmptyItem: () => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, field: string, value: string | number) => void;
  handleServiceSelect: (id: string, serviceId: string) => void;
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
}

export function InvoiceItemsTable({
  invoiceItems,
  services,
  addEmptyItem,
  removeItem,
  updateItem,
  handleServiceSelect,
  calculateSubtotal,
  calculateTax,
  calculateTotal
}: InvoiceItemsTableProps) {
  return (
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

        <InvoiceTotals 
          subtotal={calculateSubtotal()}
          tax={calculateTax()}
          total={calculateTotal()}
        />
      </CardContent>
    </Card>
  );
}

interface InvoiceTotalsProps {
  subtotal: number;
  tax: number;
  total: number;
}

function InvoiceTotals({ subtotal, tax, total }: InvoiceTotalsProps) {
  return (
    <div className="mt-6 flex justify-end print:pr-8">
      <div className="w-[300px] space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (10%):</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between border-t pt-2 font-medium">
          <span>Total:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
