
import { useClientServices } from "@/components/services/client/useClientServices";
import { ClientServicesHeader } from "@/components/services/client/ClientServicesHeader";
import { ClientServicesContent } from "@/components/services/client/ClientServicesContent";
import { ClientServicesLoader } from "@/components/services/client/ClientServicesLoader";
import { useParams } from "react-router-dom";
import { useClients } from "@/context/ClientContext";
import WorkLogPreview from "@/components/worklog/WorkLogPreview";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, ArrowRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function ClientServices() {
  const { id } = useParams<{ id: string }>();
  const { getClientById } = useClients();
  const client = id ? getClientById(id) : null;
  const navigate = useNavigate();
  
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

  const handleNavigateToWorkLog = () => {
    if (id) {
      navigate(`/clients/${id}/worklog`);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "—";
    try {
      return format(parseISO(dateString), "MMM d, yyyy");
    } catch (error) {
      console.error("Invalid date:", dateString);
      return "Invalid date";
    }
  };

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
      
      {client && client.workLogs && client.workLogs.length > 0 && (
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Work Log Information</CardTitle>
              <CardDescription>Task history and upcoming work for this client</CardDescription>
            </div>
            <Button 
              onClick={handleNavigateToWorkLog}
              variant="outline"
              className="flex items-center gap-1"
            >
              <CalendarDays className="h-4 w-4" /> Manage Work Log
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {client.workLogs.slice(0, 5).map(log => (
                <div 
                  key={log.id} 
                  className="flex justify-between items-center border-b pb-3 last:border-0 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                  onClick={handleNavigateToWorkLog}
                >
                  <div className="space-y-1 flex-grow">
                    <div className="font-medium">
                      {log.description || "Untitled Task"}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span>Created: {formatDate(log.createdAt)}</span>
                      {log.completed && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Completed
                        </Badge>
                      )}
                      {!log.completed && log.startTime && !log.endTime && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Tracking
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {log.dueDate && (
                      <div className="text-sm text-right">
                        <div className="text-muted-foreground">Due</div>
                        <div className={`font-medium ${new Date(log.dueDate) < new Date() && !log.completed ? 'text-red-600' : ''}`}>
                          {formatDate(log.dueDate)}
                        </div>
                      </div>
                    )}
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
              
              {client.workLogs.length > 5 && (
                <Button 
                  variant="ghost" 
                  className="w-full text-sm" 
                  onClick={handleNavigateToWorkLog}
                >
                  View all {client.workLogs.length} tasks
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {client && (!client.workLogs || client.workLogs.length === 0) && (
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Work Log Information</CardTitle>
              <CardDescription>No work logs found for this client</CardDescription>
            </div>
            <Button 
              onClick={handleNavigateToWorkLog}
              variant="outline"
              className="flex items-center gap-1"
            >
              <CalendarDays className="h-4 w-4" /> Create Work Log
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">No work logs have been created for this client yet</p>
              <Button 
                onClick={handleNavigateToWorkLog}
                className="flex items-center gap-1"
              >
                <CalendarDays className="h-4 w-4" /> Create First Work Log
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
