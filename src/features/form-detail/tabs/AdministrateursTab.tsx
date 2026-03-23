"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Chip,
  Divider,
  Icon,
  IconButton,
  Modal,
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
  if (admin.role === "SUPER_ADMIN") {
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
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

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
        role: user.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN",
      };

      const updated = addMockAdmin(form.id, newAdmin);
      setAdmins(updated);
      setSearchValue("");
    },
    [allUsers, form.id],
  );

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearchChange = useCallback((value: string | undefined) => {
    setSearchValue(value);
    setShowDropdown(!!value?.trim());
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
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
      const newRole = admin.role === "SUPER_ADMIN" ? "ADMIN" : "SUPER_ADMIN";
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
          const canRemove =
            isSuperAdmin && !isOwnRow(admin) && admin.role !== "SUPER_ADMIN";

          return (
            <div key={admin.id} className="flex flex-col">
              <div className="flex items-center py-2">
                <div className="w-54.25">{admin.name}</div>
                <Chip
                  id={`admin-role-${admin.id}`}
                  label={badge.label}
                  size="s"
                  icon={badge.icon}
                  iconPosition="left"
                  style={
                    badge.bg
                      ? {
                          background: badge.bg,
                          color: "var(--content-primary)",
                        }
                      : undefined
                  }
                />
                {canRemove && (
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
      <div ref={searchContainerRef} className="relative">
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
          <Icon name="search" size={16} />
          <input
            type="text"
            placeholder="Rechercher un administrateur"
            value={searchValue ?? ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => { if (filteredOptions.length > 0) setShowDropdown(true); }}
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-content-tertiary"
          />
        </div>
        {showDropdown && filteredOptions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
            {filteredOptions.slice(0, MAX_DISPLAYED_OPTIONS).map((name) => (
              <button
                key={name}
                type="button"
                className="flex items-center w-full px-3 py-2 text-left hover:bg-background-hover text-sm"
                onClick={() => { handleOptionSelect(name); setShowDropdown(false); }}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

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
