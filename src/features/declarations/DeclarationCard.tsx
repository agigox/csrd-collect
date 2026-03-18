"use client";

import { Card, Chip } from "@rte-ds/react";

interface DeclarationCardProps {
  createdAt: string;
  authorName: string;
  formName: string;
  location: string;
  onClick?: () => void;
  isSelected?: boolean;
  isNew?: boolean;
}

const DeclarationCard = ({
  createdAt,
  authorName,
  formName,
  location,
  onClick,
  isSelected = false,
  isNew = false,
}: DeclarationCardProps) => {
  const date = new Date(createdAt);
  const formattedDate = date.toLocaleDateString("fr-FR");
  const formattedTime = date.toLocaleTimeString("fr-FR", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Card
      onClick={onClick}
      clickable
      selected={isSelected}
      pressed={isNew}
      size="full"
      className="px-3 py-1.75"
    >
      {/* Row 1: Date + Time | Author chip */}
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#201f1f] tracking-tight leading-7">
            {formattedDate}
          </span>
          <span className="text-xs font-normal text-[#727272] leading-7">
            {formattedTime}
          </span>
        </div>
        <Chip
          id="author-chip"
          label={authorName}
          size="s"
          clickable={false}
          style={isNew ? { backgroundColor: "white" } : undefined}
        />
      </div>

      {/* Row 2: Title (form template name) */}
      <h3 className="text-xl font-semibold text-[#201f1f] tracking-tight leading-7 w-full">
        {formName || "Sans titre"}
      </h3>

      {/* Row 3: Location (only show if location was provided) */}
      {location && (
        <p className="text-sm font-normal text-[#11161a] leading- w-full">
          {location}
        </p>
      )}
    </Card>
  );
};

export default DeclarationCard;
