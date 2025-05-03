
import React from "react";
import { Client } from "@/types/client";
import { InfoItem } from "./InfoItem";
import { FormattedAddress } from "../address/FormattedAddress";
import { WebsiteInfo } from "./WebsiteInfo";

interface BasicInfoDisplayProps {
  client: Client;
}

export function BasicInfoDisplay({ client }: BasicInfoDisplayProps) {
  return (
    <div className="space-y-2">
      <InfoItem label="Company" value={client?.companyName || ''} />
      
      <div className="flex items-center justify-between p-2 border border-gray-200 rounded-md">
        <span className="text-sm font-medium">Website:</span>
        <WebsiteInfo website={client.website} />
      </div>
      
      <div className="flex items-center justify-between p-2 border border-gray-200 rounded-md">
        <span className="text-sm font-medium">Address:</span>
        <FormattedAddress client={client} />
      </div>
      
      <InfoItem 
        label="Start Date" 
        value={new Date(client.startDate).toLocaleDateString()}
      />
      
      {client?.endDate && client.status === "inactive" && (
        <InfoItem 
          label="End Date" 
          value={new Date(client.endDate).toLocaleDateString()}
        />
      )}
    </div>
  );
}
