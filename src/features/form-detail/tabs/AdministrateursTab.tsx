"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Chip,
  Divider,
  IconButton,
  Modal,
  Searchbar,
} from "@rte-ds/react";
import type { FormTemplate } from "@/models/FormTemplate";
import type { User } from "@/models/User";
import { fetchAdminUsers } from "@/api/users";
import { useAuthStore } from "@/stores/authStore";
import {
  getMockAdmins,
  addMockAdmin,
  removeMockAdmin,
  updateMockAdminRole,
  type MockAdmin,
} from "../mockData";

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
  const [deleteTarget, setDeleteTarget] = useState<MockAdmin | null>(null);

  const currentUser = useAuthStore((s) => s.user);
  const isSuperAdmin = currentUser?.role === "superAdmin";

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

  const handleDeleteClick = useCallback((admin: MockAdmin) => {
    setDeleteTarget(admin);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    const updated = removeMockAdmin(form.id, deleteTarget.id);
    setAdmins(updated);
    setDeleteTarget(null);
  }, [deleteTarget, form.id]);

  const handleToggleRole = useCallback(
    (admin: MockAdmin) => {
      const newRole = admin.role === "superAdmin" ? "admin" : "superAdmin";
      const updated = updateMockAdminRole(form.id, admin.id, newRole);
      setAdmins(updated);
    },
    [form.id],
  );

  const isOwnRow = (admin: MockAdmin) => admin.id === currentUser?.id;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <span className="heading-s">{admins.length} administrateur(s)</span>

      {/* Admin table */}
      <div className="flex flex-col gap-2">
        {admins.map((admin) => {
          const badge = getRoleBadge(admin);
          const canInteract =
            isSuperAdmin && !isOwnRow(admin) && admin.role !== "superAdmin";

          return (
            <div key={admin.id} className="flex flex-col">
              <div className="flex items-center py-2">
                <div className="w-54.25">{admin.name}</div>
                <Chip
                  id={`admin-role-${admin.id}`}
                  label={badge.label}
                  clickable={canInteract}
                  size="s"
                  icon={canInteract ? "arrow-chevron-down" : badge.icon}
                  iconPosition={canInteract ? "right" : "left"}
                  onClick={
                    canInteract ? () => handleToggleRole(admin) : undefined
                  }
                  style={
                    badge.bg
                      ? {
                          background: badge.bg,
                          color: "var(--content-primary)",
                          cursor: canInteract ? "pointer" : "default",
                        }
                      : undefined
                  }
                />
                {canInteract && (
                  <div className="ml-auto">
                    <IconButton
                      appearance="outlined"
                      aria-label={`Retirer ${admin.name}`}
                      name="delete"
                      onClick={() => handleDeleteClick(admin)}
                      size="s"
                      variant="danger"
                    />
                  </div>
                )}
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

      {/* Confirmation modal for admin deletion */}
      <Modal
        id="confirm-delete-admin"
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Retirer un administrateur"
        description={
          deleteTarget
            ? `Voulez-vous vraiment retirer ${deleteTarget.name} de la liste des administrateurs ?`
            : ""
        }
        size="xs"
        showCloseIcon={false}
        primaryButton={
          <Button
            variant="danger"
            label="Confirmer"
            onClick={handleConfirmDelete}
          />
        }
        secondaryButton={
          <Button
            variant="secondary"
            label="Annuler"
            onClick={() => setDeleteTarget(null)}
          />
        }
      />
    </div>
  );
}
