
import { useState } from "react";
import { User } from "@/types/auth";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ManagersTableProps {
  managers: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function ManagersTable({ managers, onEdit, onDelete }: ManagersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {managers.length > 0 ? (
          managers.map((manager) => (
            <TableRow key={manager.id}>
              <TableCell className="font-medium">{manager.name}</TableCell>
              <TableCell>{manager.email}</TableCell>
              <TableCell>{manager.username}</TableCell>
              <TableCell className="capitalize">{manager.role}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(manager)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => onDelete(manager)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
              No account managers found. Add one to get started.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
