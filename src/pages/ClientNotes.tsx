
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClients } from "@/context/ClientContext";
import { Client } from "@/types/client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import { toast } from "sonner";

export default function ClientNotes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById, updateClient } = useClients();
  const [client, setClient] = useState<Client | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const foundClient = getClientById(id);
      if (foundClient) {
        setClient(foundClient);
        setNotes(foundClient.notes || "");
      } else {
        navigate("/clients");
        toast.error("Client not found");
      }
    }
  }, [id, getClientById, navigate]);

  // Auto-save every 30 seconds if there are changes and auto-save is enabled
  useEffect(() => {
    if (!isAutoSaveEnabled || !client) return;

    const timer = setTimeout(() => {
      if (notes !== (client.notes || "")) {
        handleSave();
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [notes, isAutoSaveEnabled, client]);

  const handleSave = () => {
    if (!client) return;

    // Update client with notes
    const updatedClient = {
      ...client,
      notes: notes
    };

    updateClient(updatedClient);
    setClient(updatedClient);
    setLastSaved(new Date());
    toast.success("Notes saved successfully");
  };

  // Save notes when user navigates away
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (client && notes !== (client.notes || "")) {
        handleSave();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [notes, client]);

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{client.companyName}</h1>
          <p className="text-muted-foreground">Client Notes</p>
        </div>
        <Button 
          onClick={() => navigate(`/clients/${id}`)}
          variant="outline"
        >
          Back to Client
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your client notes here..."
              className="min-h-[400px] text-base p-4"
            />
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {lastSaved && (
                  <span>Last saved: {lastSaved.toLocaleString()}</span>
                )}
              </div>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Notes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
