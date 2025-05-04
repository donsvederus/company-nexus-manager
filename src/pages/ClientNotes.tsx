
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClients } from "@/context/ClientContext";
import { Client } from "@/types/client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ClientNotes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById, updateClient } = useClients();
  const [client, setClient] = useState<Client | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState<boolean>(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      const foundClient = getClientById(id);
      if (foundClient) {
        setClient(foundClient);
        setNotes(foundClient.notes || "");
        setHasUnsavedChanges(false);
      } else {
        navigate("/clients");
        toast.error("Client not found");
      }
    }
  }, [id, getClientById, navigate]);

  // Check for unsaved changes whenever notes change
  useEffect(() => {
    if (client) {
      setHasUnsavedChanges(notes !== (client.notes || ""));
    }
  }, [notes, client]);

  // Auto-save every 30 seconds if there are changes and auto-save is enabled
  useEffect(() => {
    if (!isAutoSaveEnabled || !client) return;

    const timer = setTimeout(() => {
      if (hasUnsavedChanges) {
        handleSave();
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [notes, isAutoSaveEnabled, client, hasUnsavedChanges]);

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
    setHasUnsavedChanges(false);
    toast.success("Notes saved successfully");
  };

  // Save notes when user navigates away
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        handleSave();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

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

      {hasUnsavedChanges && (
        <Alert className="mb-4 border-amber-500 bg-amber-50 text-amber-800">
          <AlertDescription>
            You have unsaved changes. Click the Save button to save your notes.
          </AlertDescription>
        </Alert>
      )}

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
              <Button 
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                className={hasUnsavedChanges ? "bg-green-600 hover:bg-green-700" : ""}
              >
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
