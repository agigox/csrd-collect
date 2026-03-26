"use client";

import { useState, useEffect, useCallback } from "react";
import { TextInput, Button } from "@rte-ds/react";
import { useAuthStore } from "@/stores";
import { ErrorState } from "@/lib/ui/error-state";

interface PersonalInfoTabProps {
  onDirtyChange: (dirty: boolean) => void;
}

export default function PersonalInfoTab({
  onDirtyChange,
}: PersonalInfoTabProps) {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const originalFirstName = user?.firstName ?? "";
  const originalLastName = user?.lastName ?? "";

  const [firstName, setFirstName] = useState(originalFirstName);
  const [lastName, setLastName] = useState(originalLastName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="flex flex-col gap-2.5">
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

      <div className="flex justify-end pt-4">
        <Button
          label={isSubmitting ? "Sauvegarde..." : "Modifier"}
          onClick={handleSave}
          variant="primary"
          disabled={!isDirty || isSubmitting}
          data-testid="btn-save-profile"
        />
      </div>
    </div>
  );
}
