
import { useClientServices } from "@/components/services/client/useClientServices";
import { ClientServicesHeader } from "@/components/services/client/ClientServicesHeader";
import { ClientServicesContent } from "@/components/services/client/ClientServicesContent";
import { ClientServicesLoader } from "@/components/services/client/ClientServicesLoader";

export default function ClientServices() {
  const {
    client,
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

  if (!client) {
    return <ClientServicesLoader isLoading={true} />;
  }

  return (
    <div className="space-y-6">
      <ClientServicesHeader 
        client={client}
        onSaveChanges={saveChanges}
      />

      <ClientServicesContent
        client={client}
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
    </div>
  );
}
