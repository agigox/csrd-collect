"use client";

import { useMemo } from "react";
import { Chip, Divider, Searchbar } from "@rte-ds/react";
import type { FormTemplate } from "@/models/FormTemplate";
import { getMockAdmins, type MockAdmin } from "../mockData";

interface AdministrateursTabProps {
  form: FormTemplate;
}

function getRoleBadge(admin: MockAdmin) {
  if (admin.role === "superAdmin") {
    return {
      label: "Super admin",
      bg: "var(--decorative-vert-indications)",
      icon: "user",
    };
  }
  if (admin.isCreator) {
    return {
      label: "Administrateur createur",
      bg: "var(--decorative-vert-indications)",
      icon: "check-circle",
    };
  }
  return {
    label: "Admin",
    bg: undefined,
    icon: undefined,
  };
}

export function AdministrateursTab({ form }: AdministrateursTabProps) {
  const admins = useMemo(() => getMockAdmins(form.id), [form.id]);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <span className="heading-s">{admins.length} administrateur(s)</span>

      {/* Admin table */}
      <div className="flex flex-col gap-2">
        {admins.map((admin) => {
          const badge = getRoleBadge(admin);
          return (
            <div key={admin.id} className="flex flex-col">
              <div className="flex items-center py-2">
                <div className="w-54.25">{admin.name}</div>
                <Chip
                  id={`admin-role-${admin.id}`}
                  label={badge.label}
                  clickable={false}
                  size="s"
                  icon={badge.icon}
                  style={
                    badge.bg
                      ? {
                          background: badge.bg,
                          color: "var(--content-primary)",
                        }
                      : undefined
                  }
                />
              </div>
              <Divider appearance="default" orientation="horizontal" />
            </div>
          );
        })}
      </div>

      {/* Search bar */}
      <Searchbar appearance="secondary" label="Rechercher" fullWidth />
    </div>
  );
}
