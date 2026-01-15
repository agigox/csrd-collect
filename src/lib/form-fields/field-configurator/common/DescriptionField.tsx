"use client";

import { Label } from "@/lib/ui/label";

interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const DescriptionField = ({ value, onChange }: DescriptionFieldProps) => {
  return (
    <div className="flex flex-col gap-1">
      <Label>Description</Label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Texte d'aide sous le champ"
        className="min-h-[60px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-y"
      />
    </div>
  );
};

export default DescriptionField;
