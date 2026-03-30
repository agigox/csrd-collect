"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TextInput, Button } from "@rte-ds/react";
import Link from "next/link";
import { resetPassword } from "@/api/users";
import PasswordStrengthMeter from "@/features/auth/PasswordStrengthMeter";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMinLength = password.length >= 8;
  const isPasswordValid =
    hasUpperCase && hasLowerCase && hasDigit && hasSpecial && hasMinLength;
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isFormValid = isPasswordValid && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting || !token) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => router.push("/login?reset=true"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col gap-4 items-center px-10 text-center">
        <h2 className="text-2xl font-semibold text-content-primary">
          Lien invalide
        </h2>
        <p className="text-sm text-content-secondary">
          Ce lien de r&eacute;initialisation est invalide ou a
          expir&eacute;.
        </p>
        <Link
          href="/forgot-password"
          className="text-sm underline"
          style={{ color: "#2b86ff" }}
        >
          Faire une nouvelle demande
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col gap-4 items-center px-10 text-center">
        <h2 className="text-2xl font-semibold text-content-primary">
          Mot de passe r&eacute;initialis&eacute;
        </h2>
        <p className="text-sm text-content-secondary">
          Votre mot de passe a &eacute;t&eacute; modifi&eacute; avec
          succ&egrave;s. Vous allez &ecirc;tre redirig&eacute; vers la page
          de connexion...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center px-10">
      <h2
        className="text-2xl font-semibold leading-8 text-content-primary"
        style={{
          fontFamily: "var(--font-nunito), Nunito, sans-serif",
          letterSpacing: "-0.5px",
        }}
      >
        Nouveau mot de passe
      </h2>
      <p className="text-sm text-content-secondary text-center">
        Choisissez un nouveau mot de passe pour votre compte.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
        <TextInput
          id="password"
          label="Nouveau mot de passe"
          value={password}
          onChange={(value) => setPassword(value)}
          rightIconAction="visibilityOn"
          showRightIcon
          required
          width="100%"
        />

        <PasswordStrengthMeter password={password} />

        <TextInput
          id="confirm-password"
          label="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(value) => setConfirmPassword(value)}
          rightIconAction="visibilityOn"
          showRightIcon
          required
          error={
            confirmPassword.length > 0 && !passwordsMatch
          }
          assistiveTextLabel={
            confirmPassword.length > 0 && !passwordsMatch
              ? "Les mots de passe ne correspondent pas"
              : undefined
          }
          assistiveAppearance={
            confirmPassword.length > 0 && !passwordsMatch
              ? "error"
              : "description"
          }
          width="100%"
        />

        {error && <p className="text-sm text-[#F14662]">{error}</p>}

        <div className="pt-2">
          <Button
            label={isSubmitting ? "Enregistrement..." : "Réinitialiser"}
            onClick={() => {}}
            type="submit"
            disabled={!isFormValid || isSubmitting}
            variant="primary"
            className="w-full"
          />
        </div>
      </form>

      <div className="pt-2">
        <Link
          href="/login"
          className="text-sm underline"
          style={{ color: "#2b86ff" }}
        >
          Retour &agrave; la connexion
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-gray-500">Chargement...</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
