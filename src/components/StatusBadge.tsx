
import { Badge } from "@/components/ui/badge";
import { ClientStatus } from "@/types/client";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: ClientStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      className={cn(
        "font-medium",
        status === "active" && "bg-green-100 text-green-800 hover:bg-green-100",
        status === "inactive" && "bg-red-100 text-red-800 hover:bg-red-100",
        status === "reactivated" && "bg-amber-100 text-amber-800 hover:bg-amber-100"
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
