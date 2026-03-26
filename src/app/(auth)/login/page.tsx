"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TextInput, Button } from "@rte-ds/react";
import { useAuthStore } from "@/stores";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justVerified = searchParams.get("verified") === "true";
  const login = useAuthStore((s) => s.login);
  const clearError = useAuthStore((s) => s.clearError);

  const [nniOrEmail, setNniOrEmail] = useState("");
  const [nniOrEmailTouched, setNniOrEmailTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const emailInput = document.querySelector('[data-testid="input-nni-email"] input') as HTMLInputElement | null;
      const passInput = document.querySelector('[data-testid="input-password"] input') as HTMLInputElement | null;
      if (emailInput?.value) setNniOrEmail(emailInput.value);
      if (passInput?.value) setPassword(passInput.value);
    }, 300);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isNni = /^[a-zA-Z0-9]{1,10}$/.test(nniOrEmail);
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nniOrEmail);
  const isNniOrEmailValid = isNni || isEmail;

  const getNniOrEmailError = (): string | undefined => {
    if (!nniOrEmailTouched || nniOrEmail === "") return undefined;
    if (nniOrEmail.includes("@")) {
      if (!isEmail) return "Veuillez saisir une adresse email valide";
    } else {
      if (!isNni)
        return "Le NNI doit contenir uniquement des caractères alphanumériques (max 10)";
    }
    return undefined;
  };

  const fieldError = getNniOrEmailError();
  const isFormValid = isNniOrEmailValid && password.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    clearError();

    try {
      await login(nniOrEmail.trim(), password);

      router.push("/declarations");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="h-13.25">
        Pour accéder au collecteur, veuillez vous identifier ou vous inscrire.
      </p>
      <div className="flex flex-col gap-2.75 items-center px-10">
        <h2
          className="text-2xl font-semibold leading-8 text-content-primary"
          style={{
            fontFamily: "var(--font-nunito), Nunito, sans-serif",
            letterSpacing: "-0.5px",
          }}
        >
          Se connecter
        </h2>

        {justVerified && (
          <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm text-center w-full">
            Email vérifié avec succès ! Vous pouvez maintenant vous connecter.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.75 w-full">
          <TextInput
            id="nni-email"
            label="Email ou NNI"
            value={nniOrEmail}
            onChange={(value) => setNniOrEmail(value)}
            onBlur={() => setNniOrEmailTouched(true)}
            required
            error={!!fieldError}
            assistiveTextLabel={fieldError}
            assistiveAppearance={fieldError ? "error" : "description"}
            showRightIcon={false}
            data-testid="input-nni-email"
            width="100%"
          />
          <div className="flex flex-col gap-1">
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

            {error && error.includes("non vérifié") ? (
              <div className="flex flex-col gap-1">
                <p className="text-sm text-[#F14662]">{error}</p>
                <Link
                  href={`/check-email?email=${encodeURIComponent(nniOrEmail)}`}
                  className="text-sm underline"
                  style={{ color: "#2b86ff" }}
                >
                  Renvoyer l&apos;email de vérification
                </Link>
              </div>
            ) : error ? (
              <p className="text-sm text-[#F14662]" data-testid="login-error">
                {error}
              </p>
            ) : null}
            <div className="flex items-center justify-end w-full">
              <Link
                href="#"
                className="text-sm underline"
                style={{ color: "#2b86ff" }}
                data-testid="link-mot-de-passe-oublie"
              >
                Mot de passe oublié
              </Link>
            </div>
          </div>
          <Button
            label={isSubmitting ? "Connexion..." : "Se connecter"}
            onClick={() => {}}
            type="submit"
            disabled={!isFormValid || isSubmitting}
            variant="primary"
            className="w-full"
            data-testid="btn-se-connecter"
          />
        </form>

        <div className="flex flex-col sm:flex-row items-center justify-center w-full h-12">
          <span className="text-sm text-content-secondary">
            Vous n&apos;avez pas de compte ?{" "}
          </span>
          <Link
            href="/register"
            className="text-sm underline ml-1"
            style={{ color: "#2b86ff" }}
            data-testid="link-sinscrire"
          >
            S&apos;inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-gray-500">Chargement...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
