
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "@/context/services";
import { Service, ServiceCategory } from "@/types/service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ServiceForm } from "@/components/services/ServiceForm";

const categoryOptions: ServiceCategory[] = [
  "hosting",
  "design",
  "marketing",
  "maintenance",
  "consulting",
  "other"
];

export default function AddService() {
  const navigate = useNavigate();
  const { addService, services } = useServices();
  
  // Create an empty service template
  const emptyService: Service = {
    id: "", // We'll generate an ID when the service is actually added
    name: "",
    defaultCost: 0,
    category: "other",
    description: ""
  };

  const handleSave = (serviceData: Omit<Service, "id">) => {
    addService(serviceData);
    
    setTimeout(() => {
      navigate("/services");
    }, 500);
  };

  const handleCancel = () => {
    navigate("/services");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Add New Service</h1>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
          <CardDescription>
            Enter the new service information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceForm
            service={emptyService}
            categoryOptions={categoryOptions}
            services={services}
            onSave={handleSave}
            onCancel={handleCancel}
            isNew={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
