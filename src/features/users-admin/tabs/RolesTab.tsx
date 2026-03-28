"use client";

import { useState } from "react";
import { Toast } from "@rte-ds/react";
import type { User, UserRole } from "@/models/User";
import { useAuthStore, selectIsSuperAdmin } from "@/stores/authStore";
import { updateUser } from "@/api/users";
import { RoleChip } from "../components/RoleChip";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super administrateur",
  ADMIN: "Administrateur",
  OPERATOR: "Utilisateur",
};

interface RolesTabProps {
  user: User;
  onRoleChanged: (updatedUser: User) => void;
}

export function RolesTab({ user, onRoleChanged }: RolesTabProps) {
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

  const handleRoleChange = async (role: UserRole) => {
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
    <div className="flex flex-col gap-4">
      <span className="text-sm text-gray-600">Rôle actuel :</span>
      <RoleChip
        currentRole={user.role}
        availableRoles={availableRoles}
        onRoleChange={handleRoleChange}
        disabled={saving}
      />
      <Toast
        message={toast.message}
        type={toast.type}
        isOpen={toast.open}
        autoDismiss
        duration="medium"
        placement="bottom-right"
        onClose={() => setToast((prev) => (prev.open ? { ...prev, open: false } : prev))}
      />
    </div>
  );
}
