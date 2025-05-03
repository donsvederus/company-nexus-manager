
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClients } from '@/context/ClientContext';
import ClientDetailsHeader from '@/components/client/ClientDetailsHeader';
import BasicInfoCard from '@/components/client/BasicInfoCard';
import ContactInfoCard from '@/components/client/ContactInfoCard';
import StatusManagementCard from '@/components/client/StatusManagementCard';
import ClientServiceList from '@/components/ClientServiceList';
import WorkLogPreview from '@/components/worklog/WorkLogPreview';

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

  const handleStatusChange = (newStatus: 'active' | 'inactive') => {
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
        onEdit={() => navigate(`/clients/${id}/edit`)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2 space-y-6">
          <BasicInfoCard client={client} onClientUpdate={handleClientUpdate} />
          <ContactInfoCard client={client} onClientUpdate={handleClientUpdate} />
          
          {/* Display client services */}
          <ClientServiceList client={client} />
          
          {/* Display work log preview if client has work logs */}
          {client.workLogs && client.workLogs.length > 0 && (
            <WorkLogPreview clientId={client.id} workLogs={client.workLogs} />
          )}
        </div>
        
        <div className="space-y-6">
          <StatusManagementCard 
            client={client}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </>
  );
}
