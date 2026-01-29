"use client";

import { Divider } from "@/lib/Divider";
import { Card } from "@rte-ds/react";

interface FormCardProps {
  code: string;
  title: string;
  description: string;
  onClick?: () => void;
}

export const FormCard = ({
  code,
  title,
  description,
  onClick,
}: FormCardProps) => {
  return (
    <Card onClick={onClick} clickable>
      <div className="flex-1 py-2">
        <p className="text-sm text-muted-foreground">{code}</p>
        <h3 className="text-lg font-semibold leading-tight">{title}</h3>
      </div>
      <Divider orientation="vertical" className="mx-4 my-4 bg-border-divider" />
      <div className="flex-1 py-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>
    </Card>
  );
};
