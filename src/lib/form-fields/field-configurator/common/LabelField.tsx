"use client";

import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import { cn } from "@/lib/utils";

interface LabelFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const LabelField = ({ value, onChange, className }: LabelFieldProps) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <Label>Entête</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-sm"
      />
    </div>
  );
};

export default LabelField;
