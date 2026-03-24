"use client";

import { Card } from "@rte-ds/react";

interface EmptyCardProps {
  message: string;
  className?: string;
}

export const EmptyCard = ({ message, className }: EmptyCardProps) => {
  return (
    <Card
      cardType="outlined"
      disabled
      size="full"
      className={`px-3 py-1.75 ${className ?? ""}`}
    >
      {message}
    </Card>
  );
};
