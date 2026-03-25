"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@rte-ds/react";
import type { OrgUnit } from "@/models/User";

interface SearchableSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  width?: number;
}

function SearchableSelect({ id, label, value, onChange, options, required, width }: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  const filtered = useMemo(() => {
    if (!search.trim()) return options;
    const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
    const q = normalize(search);
    return options.filter((o) => normalize(o.label).includes(q));
  }, [options, search]);

  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleOpen = () => {
    updatePosition();
    setOpen(!open);
    setSearch("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div style={{ width: width ?? 280 }} data-testid={`searchable-select-${id}`}>
      <label className="text-xs font-medium text-content-secondary mb-1 block">
        {label}{required && " *"}
      </label>
      <div
        ref={triggerRef}
        className="flex items-center gap-2 border border-border-secondary rounded-lg px-3 py-2 cursor-pointer bg-white"
        onClick={handleOpen}
      >
        <span className="flex-1 text-sm truncate">{selectedLabel || "Sélectionner..."}</span>
        {value && (
          <button
            type="button"
            className="bg-transparent border-none p-0 cursor-pointer flex items-center text-content-tertiary"
            onClick={(e) => { e.stopPropagation(); onChange(""); }}
          >
            <Icon name="close" size={14} />
          </button>
        )}
        <Icon name={open ? "arrow-up" : "arrow-down"} size={14} />
      </div>
      {open && createPortal(
        <div
          ref={dropdownRef}
          className="bg-white border border-border-secondary rounded-lg shadow-lg flex flex-col"
          style={{ position: "fixed", top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width, zIndex: 10000, maxHeight: 240 }}
        >
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border-divider shrink-0">
            <Icon name="search" size={14} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm bg-transparent outline-none border-none"
            />
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 200 }}>
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-content-tertiary">Aucun résultat</div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-background-hover cursor-pointer border-none ${opt.value === value ? "bg-background-brand-default/10 font-medium" : "bg-transparent"}`}
                  onClick={() => { onChange(opt.value); setOpen(false); setSearch(""); }}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

export const toOptions = (items: OrgUnit[]) =>
  items.map((item) => ({ value: item.id, label: item.name }));

export default SearchableSelect;
