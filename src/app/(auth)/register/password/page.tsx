"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TextInput, Button } from "@rte-ds/react";
import Link from "next/link";
import PasswordStrengthMeter, {
  evaluateCriteria,
  evaluateStrength,
} from "@/features/auth/PasswordStrengthMeter";
import { useAuthStore } from "@/stores";

function PasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const register = useAuthStore((s) => s.register);

  const nni = searchParams.get("nni") || "";
  const email = searchParams.get("email") || "";
  const lastName = searchParams.get("lastName") || "";
  const firstName = searchParams.get("firstName") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect back if nni or email missing (direct URL access)
  if (!nni || !email) {
    router.replace("/register");
    return null;
  }

  const criteria = evaluateCriteria(password);
  const strength = evaluateStrength(password, criteria);
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";
  const isFormValid = strength !== "faible" && passwordsMatch && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await register({
        nni,
        email,
        password,
        lastName: lastName || undefined,
        firstName: firstName || undefined,
      });

      // Redirect to login with success param
      router.push("/login?registered=true");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'inscription",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2.75 items-center px-10">
      <h2
        className="text-2xl font-semibold leading-8 text-content-primary"
        style={{
          fontFamily: "var(--font-nunito), Nunito, sans-serif",
          letterSpacing: "-0.5px",
        }}
      >
        Création du mot de passe
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2.75 w-full">
        <TextInput
          id="password"
          label="Mot de passe"
          value={password}
          onChange={(value) => setPassword(value)}
          rightIconAction="visibilityOn"
          showRightIcon
          required
          data-testid="input-password"
          width="100%"
        />

        <PasswordStrengthMeter password={password} />

        <div className="mt-2">
          <TextInput
            id="confirm-password"
            label="Vérification mot de passe"
            value={confirmPassword}
            onChange={(value) => setConfirmPassword(value)}
            rightIconAction="visibilityOn"
            showRightIcon
            required
            data-testid="input-confirm-password"
            width="100%"
          />
        </div>

        {error && (
          <p
            className="text-sm text-[#F14662] mt-1"
            data-testid="register-error"
          >
            {error}
          </p>
        )}

        <div className="pt-6 w-full">
          <Button
            label={isSubmitting ? "Inscription..." : "S'inscrire"}
            onClick={() => {}}
            type="submit"
            disabled={!isFormValid}
            variant="primary"
            className="w-full"
            data-testid="btn-sinscrire"
          />
        </div>
      </form>

      <p className="text-sm leading-5 w-full" style={{ color: "#acacab" }}>
        En cliquant sur le bouton s&apos;inscrire vous acceptez les conditions
        générales d&apos;utilisations.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center w-full h-12">
        <span className="text-sm text-content-secondary">
          Vous avez déjà un compte ?{" "}
        </span>
        <Link
          href="/login"
          className="text-sm underline ml-1"
          style={{ color: "#2b86ff" }}
          data-testid="link-se-connecter"
        >
          Se connecter
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-gray-500">Chargement...</div>
        </div>
      }
    >
      <PasswordForm />
    </Suspense>
  );
}
