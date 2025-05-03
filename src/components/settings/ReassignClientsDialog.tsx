
import { User } from "@/types/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Users } from "lucide-react";

interface ReassignClientsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  managerToDelete: User | null;
  managers: User[];
  clientCount: number;
  reassignTo: string;
  setReassignTo: (value: string) => void;
  onConfirm: () => void;
}

export function ReassignClientsDialog({
  isOpen,
  onOpenChange,
  managerToDelete,
  managers,
  clientCount,
  reassignTo,
  setReassignTo,
  onConfirm,
}: ReassignClientsDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reassign Clients</AlertDialogTitle>
          <AlertDialogDescription>
            {managerToDelete?.name} is currently managing {clientCount} client{clientCount !== 1 ? 's' : ''}.
            You must reassign these clients to another manager before deleting this account.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <FormItem>
            <FormLabel>Reassign to:</FormLabel>
            <Select onValueChange={setReassignTo} value={reassignTo}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a manager" />
              </SelectTrigger>
              <SelectContent>
                {managers
                  .filter(m => m.id !== managerToDelete?.id) // Exclude the manager being deleted
                  .map(manager => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.name} ({manager.role})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </FormItem>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={!reassignTo}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Reassign and Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
