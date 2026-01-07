"use client";

import Chip from "@/lib/Chip";

interface DeclarationCardProps {
  date: string;
  author: string;
  title: string;
  description: string;
  onClick?: () => void;
}

const DeclarationCard = ({
  date,
  author,
  title,
  description,
  onClick,
}: DeclarationCardProps) => {
  return (
    <div
      onClick={onClick}
      className="group relative w-full bg-white rounded overflow-hidden shadow-[0px_2px_4px_0px_rgba(0,0,0,0.14),0px_0px_2px_0px_rgba(0,0,0,0.12)] cursor-pointer transition-all duration-150"
    >
      {/* Left border accent on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-150" />

      <div className="px-3 py-2">
        {/* Header row: date + author badge */}
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-sm font-semibold text-[#201f1f] tracking-tight">
            {date}
          </span>
          <Chip>{author}</Chip>
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
