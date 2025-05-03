
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClients } from "@/context/client";
import ClientForm from "@/components/ClientForm";
import { Client, ClientFormData } from "@/types/client";
import { toast } from "sonner";

export default function EditClient() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById, updateClient } = useClients();
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    if (id) {
      const foundClient = getClientById(id);
      if (foundClient) {
        setClient(foundClient);
      } else {
        toast.error("Client not found");
        navigate("/clients");
      }
    }
  }, [id, getClientById, navigate]);

  const handleUpdateClient = (data: ClientFormData) => {
    if (client) {
      updateClient({ ...data, id: client.id });
      navigate(`/clients/${client.id}`);
    }
  };

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Loading client details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Edit Client</h1>
      <ClientForm onSubmit={handleUpdateClient} defaultValues={client} isEditing={true} />
    </div>
  );
}
