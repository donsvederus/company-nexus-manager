
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useServices } from "@/context/ServiceContext";
import { ServiceCategory } from "@/types/service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ServiceForm } from "@/components/services/ServiceForm";
import { toast } from "sonner";

const categoryOptions: ServiceCategory[] = [
  "hosting",
  "design",
  "marketing",
  "maintenance",
  "consulting",
  "other"
];

export default function ServiceEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getServiceById, updateService, services } = useServices();
  const [service, setService] = useState(null);
  
  useEffect(() => {
    if (id) {
      const serviceData = getServiceById(id);
      if (serviceData) {
        setService(serviceData);
      } else {
        toast.error("Service not found");
        navigate("/services");
      }
    }
  }, [id, getServiceById, navigate]);

  const handleSave = (updatedService) => {
    updateService(updatedService);
    setTimeout(() => {
      navigate(-1);
    }, 500);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!service) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Loading service details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Edit Service</h1>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
          <CardDescription>
            Update the service information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceForm
            service={service}
            categoryOptions={categoryOptions}
            services={services}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}
