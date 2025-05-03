
import { useClientServices } from "@/components/services/client/useClientServices";
import { ClientServicesHeader } from "@/components/services/client/ClientServicesHeader";
import { ClientServicesContent } from "@/components/services/client/ClientServicesContent";
import { ClientServicesLoader } from "@/components/services/client/ClientServicesLoader";
import { useParams } from "react-router-dom";
import { useClients } from "@/context/ClientContext";
import WorkLogPreview from "@/components/worklog/WorkLogPreview";

export default function ClientServices() {
  const { id } = useParams<{ id: string }>();
  const { getClientById } = useClients();
  const client = id ? getClientById(id) : null;
  
  const {
    client: clientService,
    services,
    clientServices,
    activeTab,
    setActiveTab,
    handleSaveCustomCost,
    handleDelete,
    handleDuplicate,
    handleToggleStatus,
    addNewService,
    saveChanges,
    getServiceDetails
  } = useClientServices();

  if (!clientService) {
    return <ClientServicesLoader isLoading={true} />;
  }

  return (
    <div className="space-y-6">
      <ClientServicesHeader 
        client={clientService}
        onSaveChanges={saveChanges}
      />

      <ClientServicesContent
        client={clientService}
        clientServices={clientServices}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSaveCustomCost={handleSaveCustomCost}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onAddNewService={addNewService}
        services={services}
        getServiceDetails={getServiceDetails}
      />
      
      {client && client.workLogs && (
        <WorkLogPreview 
          clientId={client.id}
          workLogs={client.workLogs}
        />
      )}
    </div>
  );
}
