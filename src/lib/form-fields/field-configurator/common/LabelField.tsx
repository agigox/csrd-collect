"use client";

import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";

interface LabelFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const LabelField = ({ value, onChange }: LabelFieldProps) => {
  return (
    <div className="flex flex-col gap-1">
      <Label>Entête</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-sm w-58.75"
      />
    </div>
  );
};

export default LabelField;
