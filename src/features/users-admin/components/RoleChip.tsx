"use client";

import { useRef, useState, useEffect } from "react";
import { Icon } from "@rte-ds/react";
import type { UserRole } from "@/models/User";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super administrateur",
  ADMIN: "Administrateur",
  OPERATOR: "Utilisateur",
};

interface RoleChipProps {
  currentRole: UserRole;
  availableRoles: UserRole[];
  onRoleChange: (role: UserRole) => void;
  disabled?: boolean;
}

export function RoleChip({
  currentRole,
  availableRoles,
  onRoleChange,
  disabled,
}: RoleChipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const label = ROLE_LABELS[currentRole] ?? currentRole;

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-full px-3 py-1 cursor-pointer disabled:opacity-50"
        style={{ background: "#e6f2a4" }}
      >
        <Icon name="user" size={16} />
        <span className="text-xs font-bold">{label}</span>
        <Icon name="arrow-down" size={20} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-md z-50 min-w-48">
          {availableRoles.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => {
                onRoleChange(role);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                role === currentRole ? "font-bold bg-gray-50" : ""
              }`}
            >
              {ROLE_LABELS[role] ?? role}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
