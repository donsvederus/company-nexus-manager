
import React from "react";
import { useServices } from "@/context/ServiceContext";
import { Client } from "@/types/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Globe, PlusSquare } from "lucide-react";
import { formatCurrency, getFinalCost } from "@/utils/formatUtils";

interface ClientServiceListProps {
  client: Client;
}

export default function ClientServiceList({ client }: ClientServiceListProps) {
  const navigate = useNavigate();
  const { getActiveClientServices, getServiceDetails } = useServices();
  
  const clientServices = getActiveClientServices(client.id);
  
  const calculateTotalCost = () => {
    return clientServices.reduce((total, cs) => {
      const service = getServiceDetails(cs.serviceId);
      if (service) {
        const cost = getFinalCost(service.defaultCost, cs.customCost);
        return total + cost;
      }
      return total;
    }, 0);
  };

  const defaultDomain = client.website || "";

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Client Services</CardTitle>
          <CardDescription>Active services provided to {client.companyName}</CardDescription>
        </div>
        <Button 
          onClick={() => navigate(`/clients/${client.id}/services`)}
          className="flex items-center gap-1"
        >
          <PlusSquare className="h-4 w-4" /> Manage Services
        </Button>
      </CardHeader>
      <CardContent>
        {clientServices.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No active services configured for this client</p>
            <Button 
              onClick={() => navigate(`/clients/${client.id}/services`)}
              className="flex items-center gap-1"
            >
              <PlusSquare className="h-4 w-4" /> Add Services
            </Button>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientServices.map((cs) => {
                  const service = getServiceDetails(cs.serviceId);
                  if (!service) return null;
                  
                  const finalCost = getFinalCost(service.defaultCost, cs.customCost);
                  
                  return (
                    <TableRow key={cs.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          {cs.domain || defaultDomain || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {formatCurrency(finalCost)}
                          {cs.customCost !== undefined && (
                            <Badge variant="outline" className="text-xs">
                              Custom
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{cs.notes || '-'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
              <div className="bg-muted p-4 rounded-md flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Total Monthly Cost:</span>
                <span className="text-lg font-bold">{formatCurrency(calculateTotalCost())}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
