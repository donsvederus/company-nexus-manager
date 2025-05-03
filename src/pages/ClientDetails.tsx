
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClients } from '@/context/ClientContext';
import ClientDetailsHeader from '@/components/client/ClientDetailsHeader';
import BasicInfoCard from '@/components/client/BasicInfoCard';
import ContactInfoCard from '@/components/client/ContactInfoCard';
import StatusManagementCard from '@/components/client/StatusManagementCard';
import ClientServiceList from '@/components/ClientServiceList';
import WorkLogPreview from '@/components/worklog/WorkLogPreview';
import { Client, ClientStatus } from '@/types/client';

export default function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById, deleteClient, updateClientStatus, updateLastContactDate, updateClient } = useClients();

  const client = id ? getClientById(id) : null;
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Client not found</p>
          <button 
            className="mt-4 underline text-blue-600 hover:text-blue-800"
            onClick={() => navigate('/clients')}
          >
            Back to Client List
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (id) {
      deleteClient(id);
      navigate('/clients');
    }
  };

  const handleStatusChange = (newStatus: ClientStatus) => {
    if (id) {
      updateClientStatus(id, newStatus);
    }
  };

  const handleLastContactUpdate = (date?: Date) => {
    if (id) {
      updateLastContactDate(id, date);
    }
  };

  const handleClientUpdate = (updatedClient: Client) => {
    updateClient(updatedClient);
  };

  return (
    <>
      <ClientDetailsHeader 
        client={client}
        onDelete={handleDelete}
      />

      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* Top row - aligned side by side */}
        <div className="col-span-12 space-y-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left column - Basic information */}
            <div className="col-span-12 md:col-span-8 space-y-6">
              <BasicInfoCard client={client} onClientUpdate={handleClientUpdate} />
            </div>
            
            {/* Right column - status management */}
            <div className="col-span-12 md:col-span-4">
              <StatusManagementCard 
                client={client}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
          
          {/* Contact info - full width below basic info and status */}
          <ContactInfoCard client={client} onClientUpdate={handleClientUpdate} />
          
          {/* Full width client services */}
          <ClientServiceList client={client} />
          
          {/* Full width work log preview */}
          {client.workLogs && client.workLogs.length > 0 && (
            <WorkLogPreview clientId={client.id} workLogs={client.workLogs} />
          )}
        </div>
      </div>
    </>
  );
}
