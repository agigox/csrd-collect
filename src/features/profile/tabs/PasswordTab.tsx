"use client";

import { useState, useEffect, useCallback } from "react";
import { TextInput, Button } from "@rte-ds/react";
import { changePassword } from "@/api/users";
import PasswordStrengthMeter, {
  evaluateCriteria,
  evaluateStrength,
} from "@/features/auth/PasswordStrengthMeter";
import { ErrorState } from "@/lib/ui/error-state";

interface PasswordTabProps {
  onDirtyChange: (dirty: boolean) => void;
  onClose: () => void;
}

export default function PasswordTab({ onDirtyChange }: PasswordTabProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const criteria = evaluateCriteria(newPassword);
  const strength = evaluateStrength(newPassword, criteria);
  const passwordsMatch =
    newPassword === confirmPassword && confirmPassword !== "";
  const confirmError =
    confirmTouched && confirmPassword !== "" && !passwordsMatch
      ? "Les mots de passe ne correspondent pas"
      : undefined;

  const isFormValid =
    currentPassword.trim() !== "" &&
    strength === "fort" &&
    passwordsMatch &&
    !isSubmitting;

  const isDirty =
    currentPassword !== "" || newPassword !== "" || confirmPassword !== "";

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleSave = useCallback(async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setConfirmTouched(false);
      onDirtyChange(false);
      setSuccessMessage("Mot de passe modifié avec succès");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du changement de mot de passe",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [isFormValid, currentPassword, newPassword, onDirtyChange]);

  return (
    <div className="flex flex-col gap-2.5">
      <TextInput
        id="current-password"
        label="Mot de passe actuel"
        value={currentPassword}
        onChange={(value) => {
          setCurrentPassword(value);
          setError(null);
          setSuccessMessage(null);
        }}
        rightIconAction="visibilityOn"
        showRightIcon
        required
        data-testid="input-current-password"
        width="50%"
      />

      <TextInput
        id="new-password"
        label="Nouveau mot de passe"
        value={newPassword}
        onChange={(value) => setNewPassword(value)}
        rightIconAction="visibilityOn"
        showRightIcon
        required
        data-testid="input-new-password"
        width="50%"
      />

      {newPassword && <PasswordStrengthMeter password={newPassword} />}

      <TextInput
        id="confirm-password"
        label="Confirmer le nouveau mot de passe"
        value={confirmPassword}
        onChange={(value) => {
          setConfirmPassword(value);
          if (!confirmTouched) setConfirmTouched(true);
        }}
        onBlur={() => setConfirmTouched(true)}
        rightIconAction="visibilityOn"
        showRightIcon
        required
        error={!!confirmError}
        assistiveTextLabel={confirmError}
        assistiveAppearance={confirmError ? "error" : "description"}
        data-testid="input-confirm-password"
        width="50%"
      />

      {error && <ErrorState message={error} />}

      {successMessage && (
        <p className="text-sm text-[#0B8A4D]" data-testid="password-success">
          {successMessage}
        </p>
      )}

      <div className="flex justify-end pt-4">
        <Button
          label={isSubmitting ? "Sauvegarde..." : "Modifier"}
          onClick={handleSave}
          variant="primary"
          disabled={!isFormValid}
          data-testid="btn-save-password"
        />
      </div>
    </div>
  );
}
