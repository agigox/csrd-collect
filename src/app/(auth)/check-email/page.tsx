"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@rte-ds/react";
import Link from "next/link";
import { resendVerificationEmail } from "@/api/users";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async () => {
    if (!email || resending) return;
    setResending(true);
    setError(null);
    try {
      await resendVerificationEmail(email);
      setResent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center px-10 text-center">
      <h2
        className="text-2xl font-semibold leading-8 text-content-primary"
        style={{
          fontFamily: "var(--font-nunito), Nunito, sans-serif",
          letterSpacing: "-0.5px",
        }}
      >
        Vérifiez votre email
      </h2>

      <div className="flex flex-col gap-3 items-center">
        <p className="text-sm text-content-secondary">
          Un email de vérification a été envoyé à
        </p>
        {email && (
          <p className="text-sm font-semibold text-content-primary">{email}</p>
        )}
        <p className="text-sm text-content-secondary">
          Cliquez sur le lien dans l&apos;email pour activer votre compte.
        </p>
      </div>

      <div className="flex flex-col gap-2 items-center pt-4">
        {resent ? (
          <p className="text-sm text-green-600">Email renvoyé avec succès</p>
        ) : (
          <Button
            label={resending ? "Envoi..." : "Renvoyer l'email"}
            onClick={handleResend}
            variant="secondary"
            disabled={resending || !email}
          />
        )}
        {error && <p className="text-sm text-[#F14662]">{error}</p>}
      </div>

      <div className="pt-4">
        <Link
          href="/login"
          className="text-sm underline"
          style={{ color: "#2b86ff" }}
        >
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-gray-500">Chargement...</div>
        </div>
      }
    >
      <CheckEmailContent />
    </Suspense>
  );
}
