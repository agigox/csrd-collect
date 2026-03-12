"use client";

import { Card, Chip } from "@rte-ds/react";
import { statusConfig, type FormCardStatus } from "./statusConfig";

interface FormCardProps {
  title: string;
  status?: FormCardStatus;
  selected?: boolean;
  onClick?: () => void;
}

export const FormCard = ({
  title,
  status = "draft",
  selected,
  onClick,
}: FormCardProps) => {
  const chipConfig = statusConfig[status];

  return (
    <Card
      onClick={onClick}
      clickable
      selected={selected}
      size="full"
      style={{
        height: "42px",
        background: "white",
      }}
    >
      <div className="flex w-full items-center h-full px-3">
        <span
          className="flex-1 min-w-0 truncate text-base font-normal"
          style={{ fontFamily: "Arial, sans-serif", fontSize: "16px" }}
        >
          {title}
        </span>
        <Chip
          id={`status-${title}`}
          label={chipConfig.label}
          clickable={false}
          size="s"
          style={{
            background: chipConfig.backgroundColor,
            color: "var(--content-primary)",
          }}
          icon={chipConfig.icon}
        />
      </div>
    </Card>
  );
};
