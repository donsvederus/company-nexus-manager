
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useClients } from "@/context/ClientContext";
import { Client, WorkLog } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import WorkLogList from "@/components/worklog/WorkLogList";
import WorkLogHeader from "@/components/worklog/WorkLogHeader";

export default function ClientWorkLog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById, updateClient } = useClients();
  const [client, setClient] = useState<Client | null>(null);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  
  useEffect(() => {
    if (id) {
      const foundClient = getClientById(id);
      if (foundClient) {
        setClient(foundClient);
        setWorkLogs(foundClient.workLogs || []);
      } else {
        toast.error("Client not found");
        navigate("/clients");
      }
    }
  }, [id, getClientById, navigate]);

  const handleSaveWorkLogs = () => {
    if (client) {
      const updatedClient = {
        ...client,
        workLogs
      };
      updateClient(updatedClient);
      toast.success("Work logs saved successfully");
    }
  };

  const handleAddWorkLog = () => {
    const newWorkLog: WorkLog = {
      id: uuidv4(),
      clientId: client?.id || "",
      description: "",
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setWorkLogs([...workLogs, newWorkLog]);
  };

  const handleDeleteWorkLog = (logId: string) => {
    const updatedLogs = workLogs.filter(log => log.id !== logId);
    setWorkLogs(updatedLogs);
  };

  const handleDuplicateWorkLog = (logId: string) => {
    const logToDuplicate = workLogs.find(log => log.id === logId);
    if (logToDuplicate) {
      const duplicateLog: WorkLog = {
        ...logToDuplicate,
        id: uuidv4(),
        startTime: undefined,
        endTime: undefined,
        duration: logToDuplicate.duration,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setWorkLogs([...workLogs, duplicateLog]);
    }
  };

  const handleUpdateWorkLog = (updatedLog: WorkLog) => {
    const updatedLogs = workLogs.map(log => 
      log.id === updatedLog.id ? updatedLog : log
    );
    setWorkLogs(updatedLogs);
  };

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Loading work log...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WorkLogHeader 
        client={client} 
        onSave={handleSaveWorkLogs} 
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Work Log Entries</CardTitle>
          <Button onClick={handleAddWorkLog}>Add New Log</Button>
        </CardHeader>
        <CardContent>
          {workLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground mb-4">No work log entries yet</p>
              <Button onClick={handleAddWorkLog}>Create First Entry</Button>
            </div>
          ) : (
            <WorkLogList 
              logs={workLogs} 
              onUpdate={handleUpdateWorkLog} 
              onDelete={handleDeleteWorkLog} 
              onDuplicate={handleDuplicateWorkLog} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
