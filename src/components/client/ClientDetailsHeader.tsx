
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Client } from "@/types/client";

interface ClientDetailsHeaderProps {
  client: Client;
  onDelete: () => void;
}

export default function ClientDetailsHeader({ client, onDelete }: ClientDetailsHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight">{client.companyName}</h1>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={() => navigate("/clients")}>
          Back to List
        </Button>
        <Button variant="outline" asChild>
          <a href={`/clients/${client.id}/edit`}>Edit Client</a>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Client</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the client
                record from your system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
