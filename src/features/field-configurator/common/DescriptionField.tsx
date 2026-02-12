"use client";

import { Textarea } from "@rte-ds/react";

interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const DescriptionField = ({
  value,
  onChange,
}: DescriptionFieldProps) => {
  return (
    <Textarea
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.stopPropagation()}
      rows={1}
      defaultValue={value}
    />
  );
};

export default DescriptionField;
