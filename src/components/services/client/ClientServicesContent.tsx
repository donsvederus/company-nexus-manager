
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { CurrentServicesTab } from "@/components/services/CurrentServicesTab";
import { AddServicesTab } from "@/components/services/AddServicesTab";
import { Client } from "@/types/client";
import { ClientService } from "@/types/service";
import { Service } from "@/types/service";

interface ClientServicesContentProps {
  client: Client;
  clientServices: ClientService[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSaveCustomCost: (clientServiceId: string, cost: number | undefined, notes: string, domain: string) => void;
  onDuplicate: (clientServiceId: string) => void;
  onDelete: (clientServiceId: string) => void;
  onToggleStatus: (clientServiceId: string, isActive: boolean) => void;
  onAddNewService: (serviceId: string) => void;
  services: Service[];
  getServiceDetails: (serviceId: string) => Service | undefined;
}

export const ClientServicesContent = ({
  client,
  clientServices,
  activeTab,
  setActiveTab,
  onSaveCustomCost,
  onDuplicate,
  onDelete,
  onToggleStatus,
  onAddNewService,
  services,
  getServiceDetails
}: ClientServicesContentProps) => {
  return (
    <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="current">Current Services</TabsTrigger>
        <TabsTrigger value="add">Add New Services</TabsTrigger>
      </TabsList>
      
      <TabsContent value="current">
        <CurrentServicesTab
          client={client}
          clientServices={clientServices}
          getServiceDetails={getServiceDetails}
          onAddClick={() => setActiveTab("add")}
          onSaveCustomCost={onSaveCustomCost}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      </TabsContent>
      
      <TabsContent value="add">
        <AddServicesTab
          services={services}
          clientServices={clientServices}
          onAddNewService={onAddNewService}
        />
      </TabsContent>
    </Tabs>
  );
};
