"use client";

import { Label } from "@/lib/ui/label";
import { Divider } from "@/lib/Divider";

interface RequiredToggleProps {
  required: boolean;
  onChange: (required: boolean) => void;
}

export const RequiredToggle = ({ required, onChange }: RequiredToggleProps) => {
  return (
    <div className="flex flex-col">
      <Divider className="my-2 bg-border-divider" />
      <div className="flex justify-end">
        <div className="flex items-center gap-3 mt-2">
          <button
            type="button"
            role="switch"
            aria-checked={required}
            onClick={() => onChange(!required)}
            className={`relative flex items-center h-6 w-10 rounded-full px-1 transition-colors duration-200 ${
              required
                ? "bg-[#2964a0] justify-end"
                : "bg-[#e1e1e0] border-2 border-[#737272] justify-start"
            }`}
          >
            <span
              className={`flex items-center justify-center size-4 rounded-full transition-all duration-200 ${
                required ? "bg-white" : "bg-white shadow-sm"
              }`}
            >
              {required && (
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
          <Label
            className="text-sm cursor-pointer"
            onClick={() => onChange(!required)}
          >
            Champ obligatoire
          </Label>
        </div>
      </div>
    </div>
  );
};

export default RequiredToggle;
