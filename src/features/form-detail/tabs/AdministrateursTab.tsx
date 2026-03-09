"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Chip, Divider, Searchbar } from "@rte-ds/react";
import type { FormTemplate } from "@/models/FormTemplate";
import type { User } from "@/models/User";
import { fetchAdminUsers } from "@/api/users";
import { getMockAdmins, addMockAdmin, type MockAdmin } from "../mockData";

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
  return {
    label: "Admin",
    bg: "var(--decorative-vert-indications)",
    icon: "user",
  };
}

function userToDisplayName(user: User): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.email ?? user.nni ?? user.id;
}

const MAX_DISPLAYED_OPTIONS = 5;

export function AdministrateursTab({ form }: AdministrateursTabProps) {
  const [admins, setAdmins] = useState<MockAdmin[]>(() =>
    getMockAdmins(form.id),
  );
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState<string | undefined>("");

  useEffect(() => {
    fetchAdminUsers()
      .then(setAllUsers)
      .catch(() => setAllUsers([]));
  }, []);

  const adminIds = useMemo(() => new Set(admins.map((a) => a.id)), [admins]);

  const filteredOptions = useMemo(() => {
    if (!searchValue?.trim()) return [];
    const query = searchValue.toLowerCase();
    return allUsers
      .filter((user) => !adminIds.has(user.id))
      .filter((user) => userToDisplayName(user).toLowerCase().includes(query))
      .map((user) => userToDisplayName(user));
  }, [searchValue, allUsers, adminIds]);

  const handleOptionSelect = useCallback(
    (selectedName: string) => {
      const user = allUsers.find((u) => userToDisplayName(u) === selectedName);
      if (!user) return;

      const newAdmin: MockAdmin = {
        id: user.id,
        name: userToDisplayName(user),
        role: user.role === "superAdmin" ? "superAdmin" : "admin",
      };

      const updated = addMockAdmin(form.id, newAdmin);
      setAdmins(updated);
      setSearchValue("");
    },
    [allUsers, form.id],
  );

  const handleSearchChange = useCallback((value: string | undefined) => {
    setSearchValue(value);
  }, []);

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

      {/* Search bar with autocomplete */}
      <Searchbar
        appearance="secondary"
        label="Rechercher un administrateur"
        fullWidth
        value={searchValue}
        onChange={handleSearchChange}
        options={filteredOptions}
        maxDisplayedItems={MAX_DISPLAYED_OPTIONS}
        onOptionSelect={handleOptionSelect}
      />
    </div>
  );
}
