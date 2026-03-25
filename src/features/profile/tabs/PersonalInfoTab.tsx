"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TextInput, Button, Modal } from "@rte-ds/react";
import { useAuthStore } from "@/stores";
import { deleteCurrentUser } from "@/api/users";
import { ErrorState } from "@/lib/ui/error-state";

interface PersonalInfoTabProps {
  onDirtyChange: (dirty: boolean) => void;
  onClose: () => void;
}

export default function PersonalInfoTab({
  onDirtyChange,
  onClose,
}: PersonalInfoTabProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const logout = useAuthStore((s) => s.logout);

  const originalFirstName = user?.firstName ?? "";
  const originalLastName = user?.lastName ?? "";

  const [firstName, setFirstName] = useState(originalFirstName);
  const [lastName, setLastName] = useState(originalLastName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isDirty =
    firstName !== originalFirstName || lastName !== originalLastName;

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleSave = useCallback(async () => {
    if (!isDirty || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await updateProfile({ firstName, lastName });
      onDirtyChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la sauvegarde",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isDirty,
    isSubmitting,
    firstName,
    lastName,
    updateProfile,
    onDirtyChange,
  ]);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      await deleteCurrentUser();
      logout();
      onClose();
      router.push("/login");
    } catch (err) {
      setShowDeleteConfirm(false);
      setError(
        err instanceof Error ? err.message : "Erreur lors de la suppression",
      );
      setIsDeleting(false);
    }
  }, [logout, onClose, router]);

  return (
    <div className="flex flex-col gap-4 pt-4">
      <TextInput
        id="profile-lastname"
        label="Nom"
        value={lastName}
        onChange={(value) => setLastName(value)}
        width="50%"
        data-testid="input-profile-lastname"
      />

      <TextInput
        id="profile-firstname"
        label="Prénom"
        value={firstName}
        onChange={(value) => setFirstName(value)}
        width="50%"
        data-testid="input-profile-firstname"
      />

      {error && <ErrorState message={error} />}

      <div className="flex items-center justify-between pt-4">
        <Button
          label="Supprimer le compte"
          onClick={() => setShowDeleteConfirm(true)}
          variant="danger"
          data-testid="btn-delete-account"
        />
        <Button
          label={isSubmitting ? "Sauvegarde..." : "Modifier"}
          onClick={handleSave}
          variant="primary"
          disabled={!isDirty || isSubmitting}
          data-testid="btn-save-profile"
        />
      </div>

      {showDeleteConfirm && (
        <Modal
          id="delete-account-confirm"
          isOpen={true}
          onClose={() => setShowDeleteConfirm(false)}
          title="Supprimer le compte"
          description="Cette action est irréversible. Toutes vos données seront supprimées."
          size="xs"
          primaryButton={
            <Button
              label="Annuler"
              onClick={() => setShowDeleteConfirm(false)}
              variant="secondary"
              data-testid="btn-cancel-delete"
            />
          }
          secondaryButton={
            <Button
              label={isDeleting ? "Suppression..." : "Supprimer"}
              onClick={handleDelete}
              variant="danger"
              disabled={isDeleting}
              data-testid="btn-confirm-delete"
            />
          }
        />
      )}
    </div>
  );
}
