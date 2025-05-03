
import { Button } from "@/components/ui/button";
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
import { Copy, Trash2, Pencil } from "lucide-react";

interface ServiceActionButtonsProps {
  serviceId: string; // This is actually the ID of the service in the services array
  clientServiceId: string; // This is the ID of the client service entry
  isActive: boolean;
  onEdit: (clientServiceId: string) => void;
  onDuplicate: (clientServiceId: string) => void;
  onToggleStatus: (clientServiceId: string, isActive: boolean) => void;
  onDelete: (clientServiceId: string) => void;
}

export const ServiceActionButtons = ({
  serviceId,
  clientServiceId,
  isActive,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onDelete
}: ServiceActionButtonsProps) => {
  return (
    <div className="flex items-center gap-1">
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={() => onEdit(clientServiceId)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={() => onDuplicate(clientServiceId)}
      >
        <Copy className="h-4 w-4" />
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="ghost" className="text-red-500">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this service from the client?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => onDelete(clientServiceId)} 
              className="bg-red-500 hover:bg-red-600"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
