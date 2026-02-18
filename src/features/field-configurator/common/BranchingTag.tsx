"use client";

import { Icon } from "@rte-ds/react";

interface BranchingTagProps {
  branchingColor: string;
  branchingNumber: number;
  fieldIdentifier?: string;
}

export const BranchingTag = ({
  branchingColor,
  branchingNumber,
  fieldIdentifier,
}: BranchingTagProps) => {
  // Derive parent identifier from fieldIdentifier
  // e.g. "1.2" → parent "1", option "2" → "1. (2)"
  // e.g. "1.2.3" → parent "1.2", option "3" → "1.2 (3)"
  let tagText = String(branchingNumber);
  if (fieldIdentifier) {
    const lastDotIndex = fieldIdentifier.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      const parentId = fieldIdentifier.substring(0, lastDotIndex);
      const optionNum = fieldIdentifier.substring(lastDotIndex + 1);
      const formattedParent = parentId.includes(".") ? parentId : `${parentId}.`;
      tagText = `${formattedParent} (${optionNum})`;
    }
  }

  return (
    <div
      className="flex items-center gap-1 px-2 h-5 rounded-lg text-xs text-white w-fit"
      style={{ backgroundColor: branchingColor }}
    >
      <Icon name="branch" size={14} color="white" />
      <span>{tagText}</span>
    </div>
  );
};

export default BranchingTag;
