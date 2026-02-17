"use client";

import { Icon } from "@rte-ds/react";

interface BranchingTagProps {
  branchingColor: string;
  branchingNumber: number;
}

export const BranchingTag = ({
  branchingColor,
  branchingNumber,
}: BranchingTagProps) => {
  return (
    <div
      className="flex items-center gap-1 px-2 h-5 rounded-lg text-xs text-white w-fit"
      style={{ backgroundColor: branchingColor }}
    >
      <Icon name="branch" size={14} color="white" />
      <span>{branchingNumber}</span>
    </div>
  );
};

export default BranchingTag;
