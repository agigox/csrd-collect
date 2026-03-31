"use client";

import { useState } from "react";
import { Chip, Divider, SelectableChip, Toast } from "@rte-ds/react";
import type { User, UserRole } from "@/models/User";
import { useAuthStore, selectIsSuperAdmin } from "@/stores/authStore";
import { updateUser } from "@/api/users";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super administrateur",
  ADMIN: "Administrateur",
  OPERATOR: "Utilisateur",
};

interface RolesTabProps {
  user: User;
  onRoleChanged: (updatedUser: User) => void;
  readOnly?: boolean;
}

export function RolesTab({ user, onRoleChanged, readOnly }: RolesTabProps) {
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({ open: false, type: "success", message: "" });
  const isSuperAdmin = useAuthStore(selectIsSuperAdmin);

  const availableRoles: UserRole[] = isSuperAdmin
    ? ["SUPER_ADMIN", "ADMIN", "OPERATOR"]
    : ["ADMIN", "OPERATOR"];

  const roleOptions = availableRoles.map((role) => ({
    value: role,
    label: ROLE_LABELS[role] ?? role,
  }));

  const handleRoleChange = async (value: string) => {
    const role = value as UserRole;
    if (role === user.role) return;
    setSaving(true);
    try {
      const updated = await updateUser(user.id, { role });
      onRoleChanged(updated);
      setToast({
        open: true,
        type: "success",
        message: `Rôle modifié avec succès : ${ROLE_LABELS[role] ?? role}`,
      });
    } catch {
      setToast({
        open: true,
        type: "error",
        message: "Erreur lors du changement de rôle",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-12 justify-center">
      {readOnly ? (
        <Chip
          id={`role-chip-${user.id}`}
          label={ROLE_LABELS[user.role] ?? user.role}
          icon="user"
          size="s"
          style={{
            backgroundColor: "#e6f2a4",
            color: "var(--content-primary)",
            width: "fit-content",
          }}
        />
      ) : (
        <SelectableChip
          id={`role-chip-${user.id}`}
          label={ROLE_LABELS[user.role] ?? user.role}
          icon="user"
          options={roleOptions}
          value={user.role}
          onChange={handleRoleChange}
          disabled={saving}
          backgroundColor="#e6f2a4"
        />
      )}
      <Toast
        message={toast.message}
        type={toast.type}
        isOpen={toast.open}
        autoDismiss
        duration="medium"
        placement="bottom-right"
        onClose={() =>
          setToast((prev) => (prev.open ? { ...prev, open: false } : prev))
        }
      />
      <Divider />
    </div>
  );
}
