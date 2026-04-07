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
import {
  fetchTemplateAdmins,
  addTemplateAdmin,
  removeTemplateAdmin,
} from "@/api/forms";
import { useAuthStore } from "@/stores/authStore";

interface AdministrateursTabProps {
  form: FormTemplate;
}

interface AdminEntry {
  id: string;
  name: string;
  role: string;
}

function userToDisplayName(user: { firstName?: string; lastName?: string; email?: string | null; nni?: string | null; id: string }): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.email ?? user.nni ?? user.id;
}

function getRoleBadge(admin: AdminEntry) {
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

const MAX_DISPLAYED_OPTIONS = 5;

export function AdministrateursTab({ form }: AdministrateursTabProps) {
  const [admins, setAdmins] = useState<AdminEntry[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState<string | undefined>("");
  const [deleteTarget, setDeleteTarget] = useState<AdminEntry | null>(null);
  const [loading, setLoading] = useState(true);

  const currentUser = useAuthStore((s) => s.user);
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  // Load admins from backend
  useEffect(() => {
    setLoading(true);
    fetchTemplateAdmins(form.id)
      .then((users) => {
        setAdmins(
          users.map((u) => ({
            id: u.id,
            name: userToDisplayName(u),
            role: u.role,
          })),
        );
      })
      .catch(() => setAdmins([]))
      .finally(() => setLoading(false));
  }, [form.id]);

  // Load all admin/super_admin users for the search
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
      .map((user) => ({ id: user.id, name: userToDisplayName(user), role: user.role }));
  }, [searchValue, allUsers, adminIds]);

  const handleOptionSelect = useCallback(
    async (selected: { id: string; name: string; role: string }) => {
      try {
        await addTemplateAdmin(form.id, selected.id);
        setAdmins((prev) => [
          ...prev,
          { id: selected.id, name: selected.name, role: selected.role },
        ]);
        setSearchValue("");
      } catch {
        // silently fail
      }
    },
    [form.id],
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

  const handleDeleteClick = useCallback((admin: AdminEntry) => {
    setDeleteTarget(admin);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await removeTemplateAdmin(form.id, deleteTarget.id);
      setAdmins((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    } catch {
      // silently fail
    }
    setDeleteTarget(null);
  }, [deleteTarget, form.id]);

  const isOwnRow = (admin: AdminEntry) => admin.id === currentUser?.id;

  if (loading) {
    return <div className="text-sm text-content-secondary">Chargement...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <span className="heading-s">{admins.length} administrateur(s)</span>

      {/* Admin table */}
      <div className="flex flex-col gap-2">
        {admins.map((admin) => {
          const badge = getRoleBadge(admin);
          const canRemove =
            isSuperAdmin && !isOwnRow(admin);

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
            {filteredOptions.slice(0, MAX_DISPLAYED_OPTIONS).map((opt) => (
              <button
                key={opt.id}
                type="button"
                className="flex items-center w-full px-3 py-2 text-left hover:bg-background-hover text-sm"
                onClick={() => { handleOptionSelect(opt); setShowDropdown(false); }}
              >
                {opt.name}
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
