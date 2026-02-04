"use client";

import { Label } from "@/lib/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui/tooltip";
import type {
  FieldProps,
  FieldRegistration,
  SwitchFieldConfig,
} from "@/models/FieldTypes";

const SwitchField = ({
  config,
  value,
  onChange,
}: FieldProps<SwitchFieldConfig>) => {
  const isChecked = Boolean(value);

  const handleToggle = () => {
    onChange(!isChecked);
  };

  const labelElement = (
    <Label
      htmlFor={config.name}
      className="text-sm text-content-primary cursor-pointer"
      onClick={handleToggle}
    >
      {config.label}
    </Label>
  );
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-3 px-2 py-1">
        {/* Switch Track */}
        <button
          type="button"
          role="switch"
          aria-checked={isChecked}
          onClick={handleToggle}
          className={`relative flex items-center h-6 w-10 rounded-full px-1 transition-colors duration-200 ${
            isChecked
              ? "bg-[#2964a0] justify-end"
              : "bg-[#e1e1e0] border-2 border-[#737272] justify-start"
          }`}
        >
          {/* Handle */}
          <span
            className={`flex items-center justify-center size-4 rounded-full transition-all duration-200 ${
              isChecked ? "bg-white" : "bg-white shadow-sm"
            }`}
          >
            {isChecked && (
              <svg
                width="10"
                height="8"
                viewBox="0 0 10 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 4L3.5 6.5L9 1"
                  stroke="#2964a0"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        </button>

        {/* Label with Tooltip */}
        {config.description ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">{labelElement}</span>
            </TooltipTrigger>
            <TooltipContent>{config.description}</TooltipContent>
          </Tooltip>
        ) : (
          labelElement
        )}
      </div>
    </div>
  );
};

export const fieldRegistration: FieldRegistration = {
  type: "switch",
  component: SwitchField,
  defaultConfig: {},
};

export default SwitchField;
