
import { Input } from "@/components/ui/input";
import React from "react";

interface BasicInfoEditFormProps {
  editedInfo: {
    companyName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    startDate: string;
    website: string;
  };
  handleInputChange: (field: string, value: string) => void;
}

export function BasicInfoEditForm({ 
  editedInfo, 
  handleInputChange 
}: BasicInfoEditFormProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Company:</span>
        <div className="w-2/3">
          <Input 
            value={editedInfo.companyName || ''} 
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            className="h-8 text-sm w-full"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Website:</span>
        <div className="w-2/3">
          <Input 
            value={editedInfo.website || ''}
            onChange={(e) => handleInputChange('website', e.target.value)}
            className="h-8 text-sm w-full"
            placeholder="example.com"
          />
        </div>
      </div>
      
      {/* Address fields */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Street:</span>
        <div className="w-2/3">
          <Input 
            value={editedInfo.street || ''} 
            onChange={(e) => handleInputChange('street', e.target.value)}
            className="h-8 text-sm w-full"
            placeholder="123 Main St"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">City:</span>
        <div className="w-2/3">
          <Input 
            value={editedInfo.city || ''} 
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="h-8 text-sm w-full"
            placeholder="Anytown"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">State:</span>
          <div className="w-2/3">
            <Input 
              value={editedInfo.state || ''} 
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="h-8 text-sm w-full uppercase"
              placeholder="CA"
              maxLength={2}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">ZIP:</span>
          <div className="w-2/3">
            <Input 
              value={editedInfo.zipCode || ''} 
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              className="h-8 text-sm w-full"
              placeholder="12345"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Start Date:</span>
        <div className="w-2/3">
          <Input 
            type="date"
            value={new Date(editedInfo.startDate || '').toISOString().split('T')[0]} 
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="h-8 text-sm w-full"
          />
        </div>
      </div>
    </div>
  );
}
