"use client";

import { useState, useMemo } from "react";
import type { Declaration } from "@/models/Declaration";
import Icon from "@/lib/Icons";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/lib/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Chip } from "@rte-ds/react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  label: string;
  options: FilterOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

const FilterSelect = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Sélectionner...",
}: FilterSelectProps) => {
  const [open, setOpen] = useState(false);
  const maxVisibleChips = 2;
  const selectedOptions = options.filter((opt) => value.includes(opt.value));
  const visibleChips = selectedOptions.slice(0, maxVisibleChips);
  const hiddenCount = selectedOptions.length - maxVisibleChips;

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const handleRemoveChip = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  return (
    <div className="flex items-start gap-0 w-full">
      {/* Left label */}
      <div className="flex-shrink-0 w-[140px] py-1.5 pr-2 text-right">
        <span className="text-sm text-[#3e3e3d]">{label}</span>
      </div>

      {/* Input */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "flex-1 max-w-[280px] min-w-[112px] h-8 flex items-center gap-2 px-2 py-1",
              "border border-[#a1a1a0] rounded bg-white cursor-pointer",
              "shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.14)]",
              "hover:border-gray-400 transition-colors",
            )}
          >
            {/* Chips or placeholder */}
            <div className="flex-1 flex items-center gap-2 overflow-hidden">
              {value.length === 0 ? (
                <span className="text-sm text-gray-400 truncate">
                  {placeholder}
                </span>
              ) : (
                <div className="flex items-center gap-2 overflow-hidden">
                  {visibleChips.map((opt) => (
                    <Chip
                      key={opt.value}
                      id={opt.value}
                      label={opt.label}
                      onClose={(e) => {
                        e.stopPropagation();
                        handleRemoveChip(opt.value);
                      }}
                      compactSpacing
                      type="input"
                      className="px-2!"
                    />
                  ))}
                  {hiddenCount > 0 && (
                    <span className="inline-flex items-center justify-center bg-[#2964a0] text-white text-xs font-bold rounded-full min-w-4 h-4 px-0.5">
                      +{hiddenCount}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-2 shrink-0">
              {value.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="hover:bg-gray-100 rounded p-0.5 transition-colors"
                  aria-label="Effacer"
                >
                  <Icon name="reset" size={16} className="opacity-70" />
                </button>
              )}
              <ChevronDownIcon
                className={cn(
                  "size-5 opacity-50 transition-transform duration-200",
                  open && "rotate-180",
                )}
              />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <div className="flex flex-col py-1 max-h-60 overflow-y-auto">
            {options.map((option) => {
              const isSelected = value.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleToggle(option.value)}
                  className="flex items-center gap-3 px-3 py-1.5 hover:bg-accent transition-colors text-left"
                >
                  <div
                    className={cn(
                      "flex items-center justify-center size-4 rounded border-2 transition-colors shrink-0",
                      isSelected
                        ? "border-[#2964a0] bg-[#2964a0]"
                        : "border-[#737272] bg-white",
                    )}
                  >
                    {isSelected && (
                      <svg
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-foreground">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export interface FiltersState {
  status: string[];
  authorName: string[];
  teamId: string[];
}

interface FiltersProps {
  isOpen: boolean;
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  declarations: Declaration[];
  onClose?: () => void;
}

const Filters = ({ isOpen, filters, onFiltersChange, declarations, onClose }: FiltersProps) => {
  if (!isOpen) {
    return null;
  }

  // Status options - hardcoded with French labels
  const statusOptions: FilterOption[] = [
    { value: "draft", label: "Brouillon" },
    { value: "pending", label: "En attente" },
    { value: "validated", label: "Validé" },
  ];

  // Extract unique author names from declarations
  const authorNameOptions: FilterOption[] = useMemo(() => {
    const uniqueAuthors = Array.from(
      new Set(declarations.map((d) => d.authorName))
    ).sort();
    return uniqueAuthors.map((name) => ({
      value: name,
      label: name,
    }));
  }, [declarations]);

  // Extract unique team IDs from declarations
  const teamIdOptions: FilterOption[] = useMemo(() => {
    const uniqueTeams = Array.from(
      new Set(declarations.map((d) => d.teamId))
    ).sort();
    return uniqueTeams.map((id) => ({
      value: id,
      label: `Équipe ${id}`,
    }));
  }, [declarations]);

  return (
    <div className="flex flex-col gap-2 pb-2">
      {/* Title row with close icon */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-black tracking-tight">
          Filtres
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/5 rounded transition-colors"
            aria-label="Fermer les filtres"
          >
            <Icon name="close" size={20} color="#201f1f" />
          </button>
        )}
      </div>

      {/* Filter rows */}
      <FilterSelect
        label="Statut"
        options={statusOptions}
        value={filters.status}
        onChange={(value) =>
          onFiltersChange({ ...filters, status: value })
        }
        placeholder="Tous les statuts"
      />

      <FilterSelect
        label="Auteur"
        options={authorNameOptions}
        value={filters.authorName}
        onChange={(value) =>
          onFiltersChange({ ...filters, authorName: value })
        }
        placeholder="Tous les auteurs"
      />

      <FilterSelect
        label="Équipe"
        options={teamIdOptions}
        value={filters.teamId}
        onChange={(value) =>
          onFiltersChange({ ...filters, teamId: value })
        }
        placeholder="Toutes les équipes"
      />

      {/* Divider */}
      <div className="w-full h-px bg-[#cdcccb] mt-2" />
    </div>
  );
};

export default Filters;
