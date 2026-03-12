"use client";

import { IconButton } from "@rte-ds/react";

interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const SidePanel = ({ open, onClose, children }: SidePanelProps) => {
  if (!open) return null;

  return (
    <div
      className="flex flex-col h-screen w-full sticky top-0 border-l bg-background gap-4"
      style={{
        boxShadow: "0 2px 4px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.14)",
      }}
    >
      {/* Close button */}
      <div className="flex justify-end px-4 pt-4">
        <IconButton
          appearance="outlined"
          aria-label="close"
          name="close"
          onClick={onClose}
          size="m"
          variant="neutral"
          iconColor="var(--content-tertiary)"
        />
      </div>

      {children}
    </div>
  );
};
