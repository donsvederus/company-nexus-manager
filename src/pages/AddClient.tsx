
import ClientForm from "@/components/ClientForm";
import { useClients } from "@/context/ClientContext";
import { useNavigate } from "react-router-dom";
import { ClientFormData } from "@/types/client";

export default function AddClient() {
  const { addClient } = useClients();
  const navigate = useNavigate();

  const handleAddClient = (data: ClientFormData) => {
    addClient(data);
    navigate("/clients");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Add New Client</h1>
      <ClientForm onSubmit={handleAddClient} />
    </div>
  );
}
