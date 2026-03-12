"use client";

import { useState } from "react";
import { Icon, Divider } from "@rte-ds/react";

interface AccordionSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  "data-testid"?: string;
}

export const AccordionSection = ({
  title,
  defaultOpen = false,
  children,
  "data-testid": testId,
}: AccordionSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div data-testid={testId}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full cursor-pointer"
        aria-expanded={isOpen}
      >
        <span
          className="text-sm text-[#727272] font-normal w-[87px] text-left"
          style={{ fontSize: "13px" }}
        >
          {title}
        </span>
        <div className="flex-1">
          <Divider
            appearance="default"
            orientation="horizontal"
            borderColor="#727272"
          />
        </div>

        <Icon
          name={isOpen ? "arrow-chevron-up" : "arrow-chevron-down"}
          size={20}
          color="#727272"
        />
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-200"
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          gridTemplateColumns: "1fr",
        }}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1.5 py-2 mx-px">{children}</div>
        </div>
      </div>
    </div>
  );
};
