
import { Globe } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DomainDisplayProps {
  isEditing: boolean;
  domain: string;
  defaultDomain: string;
  onDomainChange?: (value: string) => void;
}

export const DomainDisplay = ({ 
  isEditing, 
  domain, 
  defaultDomain,
  onDomainChange 
}: DomainDisplayProps) => {
  const displayDomain = domain || defaultDomain || "-";

  if (isEditing) {
    return (
      <Input
        value={domain}
        onChange={(e) => onDomainChange?.(e.target.value)}
        className="w-32"
        placeholder={defaultDomain || "example.com"}
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      {displayDomain}
    </div>
  );
};
