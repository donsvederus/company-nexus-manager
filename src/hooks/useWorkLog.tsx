
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useClients } from "@/context/ClientContext";
import { Client, WorkLog } from "@/types/client";
import { toast } from "sonner";

export function useWorkLog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById, updateClient } = useClients();
  const [client, setClient] = useState<Client | null>(null);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // Load client data
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

  // Auto-save changes when workLogs change
  useEffect(() => {
    // Skip initial load
    if (!client || !isDirty) return;
    
    const saveTimeout = setTimeout(() => {
      handleSaveWorkLogs(false);
    }, 1000); // Auto-save after 1 second of inactivity
    
    return () => clearTimeout(saveTimeout);
  }, [workLogs, isDirty]);

  const handleSaveWorkLogs = (showToast = true) => {
    if (!client) return;
    
    setIsLoading(true);
    
    try {
      const updatedClient = {
        ...client,
        workLogs
      };
      
      updateClient(updatedClient);
      setIsDirty(false);
      
      if (showToast) {
        toast.success("Work logs saved successfully");
      }
    } catch (error) {
      toast.error("Failed to save work logs");
      console.error("Save error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWorkLog = () => {
    const newWorkLog: WorkLog = {
      id: uuidv4(),
      clientId: client?.id || "",
      description: "",
      notes: "",
      completed: false,
      recurring: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setWorkLogs([...workLogs, newWorkLog]);
    setIsDirty(true);
  };

  const handleDeleteWorkLog = (logId: string) => {
    const updatedLogs = workLogs.filter(log => log.id !== logId);
    setWorkLogs(updatedLogs);
    setIsDirty(true);
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
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setWorkLogs([...workLogs, duplicateLog]);
      setIsDirty(true);
    }
  };

  const handleUpdateWorkLog = (updatedLog: WorkLog) => {
    const updatedLogs = workLogs.map(log => 
      log.id === updatedLog.id ? updatedLog : log
    );
    setWorkLogs(updatedLogs);
    setIsDirty(true);
  };

  const handleToggleComplete = (logId: string, completed: boolean) => {
    const updatedLogs = workLogs.map(log => 
      log.id === logId 
        ? { ...log, completed, updatedAt: new Date().toISOString() } 
        : log
    );
    setWorkLogs(updatedLogs);
    setIsDirty(true);
  };

  const handleToggleRecurring = (logId: string, recurring: boolean) => {
    const updatedLogs = workLogs.map(log => 
      log.id === logId 
        ? { ...log, recurring, updatedAt: new Date().toISOString() } 
        : log
    );
    setWorkLogs(updatedLogs);
    setIsDirty(true);
  };

  const handleSetRecurrenceSchedule = (logId: string, recurrenceType: string, nextDate?: Date) => {
    const updatedLogs = workLogs.map(log => 
      log.id === logId 
        ? { 
            ...log, 
            recurring: true,
            recurrenceType,
            nextRecurrenceDate: nextDate ? nextDate.toISOString() : undefined,
            updatedAt: new Date().toISOString() 
          } 
        : log
    );
    setWorkLogs(updatedLogs);
    setIsDirty(true);
    toast.success(`Recurrence set to ${recurrenceType}`);
  };

  return {
    client,
    workLogs,
    isLoading,
    isDirty,
    handleSaveWorkLogs,
    handleAddWorkLog,
    handleDeleteWorkLog,
    handleDuplicateWorkLog,
    handleUpdateWorkLog,
    handleToggleComplete,
    handleToggleRecurring,
    handleSetRecurrenceSchedule
  };
}
