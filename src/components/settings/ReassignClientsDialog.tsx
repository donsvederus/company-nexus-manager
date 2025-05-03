
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
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { 
  Form,
  FormField,
  FormItem, 
  FormLabel, 
  FormControl 
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

// Create a schema for our form
const formSchema = z.object({
  reassignTo: z.string().min(1, "You must select a manager")
});

type FormData = z.infer<typeof formSchema>;

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
  // Set up form with react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reassignTo: reassignTo || ""
    }
  });

  // Update the parent component's state when form value changes
  const handleValueChange = (value: string) => {
    setReassignTo(value);
  };

  // Handle form submission
  const handleSubmit = form.handleSubmit(() => {
    onConfirm();
  });

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
        
        <Form {...form}>
          <form className="py-4">
            <FormField
              control={form.control}
              name="reassignTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reassign to:</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleValueChange(value);
                      }} 
                      value={field.value}
                    >
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
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>

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
