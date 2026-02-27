"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput, Button } from "@rte-ds/react";
import { useAuthStore } from "@/stores";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const clearError = useAuthStore((s) => s.clearError);

  const [nniOrEmail, setNniOrEmail] = useState("");
  const [nniOrEmailTouched, setNniOrEmailTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

            {error && (
              <p className="text-sm text-[#F14662]" data-testid="login-error">
                {error}
              </p>
            )}
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
