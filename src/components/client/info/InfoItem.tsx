
import React from "react";

interface InfoItemProps {
  label: string;
  value: string;
}

export function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="flex items-center justify-between p-2 border border-gray-200 rounded-md">
      <span className="text-sm font-medium">{label}:</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
