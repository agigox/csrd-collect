"use client";

import Chip from "@/lib/Chip";

interface DeclarationCardProps {
  createdAt: string;
  authorName: string;
  title: string;
  description: string;
  onClick?: () => void;
  isSelected?: boolean;
  isNew?: boolean;
}

const DeclarationCard = ({
  createdAt,
  authorName,
  title,
  description,
  onClick,
  isSelected = false,
  isNew = false,
}: DeclarationCardProps) => {
  // Format date from ISO string to display format
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('fr-FR');
  };
  const getBackground = () => {
    if (isNew) {
      return "linear-gradient(to left, rgba(34, 197, 94, 0.12), rgba(34, 197, 94, 0.12)), linear-gradient(to left, #ffffff, #ffffff)";
    }
    if (isSelected) {
      return "linear-gradient(to left, rgba(41, 100, 160, 0.08), rgba(41, 100, 160, 0.08)), linear-gradient(to left, #ffffff, #ffffff)";
    }
    return "linear-gradient(to left, rgba(255, 255, 255, 0.00), rgba(255, 255, 255, 0.00)), linear-gradient(to left, #ffffff, #ffffff)";
  };

  const getBorderColor = () => {
    if (isNew) return "bg-green-500";
    return "bg-primary";
  };

  return (
    <div
      onClick={onClick}
      className="group relative w-full rounded overflow-hidden cursor-pointer transition-all duration-150"
      style={{
        background: getBackground(),
        boxShadow:
          "0px 0px 2px 0px rgba(0, 0, 0, 0.12),  0px 2px 4px 0px rgba(0, 0, 0, 0.14)",
      }}
    >
      {/* Left border accent on hover or when selected/new */}
      <div className={`absolute left-0 top-0 bottom-0 w-0.75 ${getBorderColor()} transition-opacity duration-150 ${isSelected || isNew ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />

      <div className="px-3 py-2">
        {/* Header row: date + author badge */}
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-sm font-semibold text-[#201f1f] tracking-tight">
            {formatDate(createdAt)}
          </span>
          <Chip>{authorName}</Chip>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-[#201f1f] tracking-tight leading-7">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#11161a] leading-5 font-normal">
          {description}
        </p>
      </div>
    </div>
  );
};

export default DeclarationCard;
