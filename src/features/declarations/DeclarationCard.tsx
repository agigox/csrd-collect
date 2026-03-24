"use client";

import { Card, Chip, Icon } from "@rte-ds/react";

interface DeclarationCardProps {
  createdAt: string;
  authorName: string;
  formName: string;
  location: string;
  onClick?: () => void;
  isSelected?: boolean;
  isNew?: boolean;
  completionStatus?: "incomplet" | "complet";
}

const DeclarationCard = ({
  createdAt,
  authorName,
  formName,
  location,
  onClick,
  isSelected = false,
  isNew = false,
  completionStatus,
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
        <div className="flex items-center gap-2">
          {completionStatus !== "complet" && (
            <div
              style={{
                backgroundColor: "#f5de93",
                color: "#201f1f",
                borderRadius: "4px",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="incomplete" size={20} />
            </div>
          )}
          <Chip
            id="author-chip"
            label={authorName}
            size="s"
            clickable={false}
            style={isNew ? { backgroundColor: "white" } : undefined}
          />
        </div>
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
