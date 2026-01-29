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
  return <Textarea onChange={(e) => onChange(e.target.value)} rows={3} />;
};

export default DescriptionField;
