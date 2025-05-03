
import { Client } from "@/types/client";

interface ClientServicesLoaderProps {
  isLoading: boolean;
}

export const ClientServicesLoader = ({ isLoading }: ClientServicesLoaderProps) => {
  if (!isLoading) return null;
  
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p className="text-muted-foreground">Loading client services...</p>
      </div>
    </div>
  );
};
