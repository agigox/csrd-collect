"use client";

import { Label } from "@/lib/ui/label";
import { Textarea } from "@/lib/ui/textarea";

interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const DescriptionField = ({
  value,
  onChange,
}: DescriptionFieldProps) => {
  return (
    <div className="flex flex-col">
      <Label>Description</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-15 resize-y"
      />
    </div>
  );
};

export default DescriptionField;
