"use client";

import { useState } from "react";
import { TextInput, Button } from "@rte-ds/react";
import Link from "next/link";
import { forgotPassword } from "@/api/users";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailError =
    emailTouched && email && !isEmailValid
      ? "Veuillez saisir une adresse email valide"
      : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-4 items-center px-10 text-center">
        <h2
          className="text-2xl font-semibold leading-8 text-content-primary"
          style={{
            fontFamily: "var(--font-nunito), Nunito, sans-serif",
            letterSpacing: "-0.5px",
          }}
        >
          Email envoy&eacute;
        </h2>
        <p className="text-sm text-content-secondary">
          Si un compte existe avec l&apos;adresse <strong>{email}</strong>, un
          email contenant un lien de r&eacute;initialisation vous a
          &eacute;t&eacute; envoy&eacute;.
        </p>
        <p className="text-sm text-content-secondary">
          V&eacute;rifiez votre bo&icirc;te de r&eacute;ception et vos spams.
        </p>
        <div className="pt-4">
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

  return (
    <div className="flex flex-col gap-4 items-center px-10">
      <h2
        className="text-2xl font-semibold leading-8 text-content-primary"
        style={{
          fontFamily: "var(--font-nunito), Nunito, sans-serif",
          letterSpacing: "-0.5px",
        }}
      >
        Mot de passe oubli&eacute;
      </h2>
      <p className="text-sm text-content-secondary text-center">
        Saisissez votre adresse email. Vous recevrez un lien pour
        r&eacute;initialiser votre mot de passe.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <TextInput
          id="email"
          label="Email"
          value={email}
          onChange={(value) => setEmail(value)}
          onBlur={() => setEmailTouched(true)}
          required
          showRightIcon={false}
          error={!!emailError}
          assistiveTextLabel={emailError}
          assistiveAppearance={emailError ? "error" : "description"}
          width="100%"
        />

        {error && <p className="text-sm text-[#F14662]">{error}</p>}

        <Button
          label={isSubmitting ? "Envoi..." : "Envoyer le lien"}
          onClick={() => {}}
          type="submit"
          disabled={!isEmailValid || isSubmitting}
          variant="primary"
          className="w-full"
        />
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
