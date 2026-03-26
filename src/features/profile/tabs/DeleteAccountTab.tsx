"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, Modal } from "@rte-ds/react";
import { useAuthStore } from "@/stores";
import { deleteCurrentUser } from "@/api/users";
import { ErrorState } from "@/lib/ui/error-state";

interface DeleteAccountTabProps {
  onClose: () => void;
}

export default function DeleteAccountTab({ onClose }: DeleteAccountTabProps) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="flex flex-col gap-4">
      <p className="text-sm text-content-secondary">
        La suppression de votre compte est définitive. Toutes vos données
        personnelles et vos déclarations seront supprimées.
      </p>

      {error && <ErrorState message={error} />}

      <div className="flex">
        <Button
          label="Supprimer le compte"
          onClick={() => setShowDeleteConfirm(true)}
          variant="danger"
          data-testid="btn-delete-account"
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
