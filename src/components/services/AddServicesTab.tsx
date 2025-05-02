
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ServiceCard } from "./ServiceCard";
import { Service, ClientService } from "@/types/service";

interface AddServicesTabProps {
  services: Service[];
  clientServices: ClientService[];
  onAddNewService: (serviceId: string) => void;
}

export const AddServicesTab = ({
  services,
  clientServices,
  onAddNewService
}: AddServicesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Services</CardTitle>
        <CardDescription>
          Select services to add to this client
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((service) => {
            const isAssigned = clientServices.some(cs => cs.serviceId === service.id && cs.isActive);
            
            return (
              <ServiceCard 
                key={service.id}
                service={service}
                isAssigned={isAssigned}
                onAddService={onAddNewService}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
