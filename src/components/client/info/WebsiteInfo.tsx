
import { Globe } from "lucide-react";

interface WebsiteInfoProps {
  website?: string;
}

export function WebsiteInfo({ website }: WebsiteInfoProps) {
  if (!website) {
    return <span className="text-sm text-muted-foreground">Not specified</span>;
  }
  
  return (
    <div className="text-sm flex items-center">
      <Globe className="h-3 w-3 mr-1 inline text-muted-foreground" />
      <a 
        href={`http://${website}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        {website}
      </a>
    </div>
  );
}
