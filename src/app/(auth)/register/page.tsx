"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput, Button } from "@rte-ds/react";
import Link from "next/link";

export default function RegisterStep1Page() {
  const router = useRouter();

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [nniOrEmail, setNniOrEmail] = useState("");
  const [nniOrEmailTouched, setNniOrEmailTouched] = useState(false);

  const isNni = /^[a-zA-Z0-9]{5,6}$/.test(nniOrEmail);
  const isEmail = /^[^\s@]+@rte-france\.com$/.test(nniOrEmail);
  const isFieldValid = isNni || isEmail;

  const getFieldError = (): string | undefined => {
    if (!nniOrEmailTouched || nniOrEmail === "") return undefined;
    if (nniOrEmail.includes("@")) {
      if (!isEmail)
        return "L'adresse email doit être au format @rte-france.com";
    } else {
      if (!isNni)
        return "Le NNI doit contenir 5 ou 6 caractères alphanumériques";
    }
    return undefined;
  };

  const fieldError = getFieldError();

  const handleContinue = () => {
    if (!isFieldValid) return;

    // Pass data to step 2 via searchParams
    const params = new URLSearchParams();
    params.set("nniOrEmail", nniOrEmail);
    if (lastName) params.set("lastName", lastName);
    if (firstName) params.set("firstName", firstName);

    router.push(`/register/password?${params.toString()}`);
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
        S&apos;inscrire
      </h2>

      <div className="flex flex-col sm:flex-row gap-2.5 w-full">
        <TextInput
          id="lastName"
          label="Nom"
          value={lastName}
          onChange={(value) => setLastName(value)}
          data-testid="input-lastName"
          width="100%"
        />
        <TextInput
          id="firstName"
          label="Prénom"
          value={firstName}
          onChange={(value) => setFirstName(value)}
          data-testid="input-firstName"
          width="100%"
        />
      </div>

      <TextInput
        id="nni-email"
        label="Email ou NNI"
        value={nniOrEmail}
        onChange={(value) =>
          setNniOrEmail(
            value.includes("@") ? value.toLowerCase() : value.toUpperCase(),
          )
        }
        onBlur={() => setNniOrEmailTouched(true)}
        required
        error={!!fieldError}
        placeholder={"admin@rte-france.com OU AB123"}
        assistiveTextLabel={fieldError}
        assistiveAppearance={fieldError ? "error" : "description"}
        data-testid="input-nni-email"
        width="100%"
      />

      <div className="pt-6 w-full">
        <Button
          label="Poursuivre"
          onClick={handleContinue}
          disabled={!isFieldValid}
          variant="primary"
          className="w-full"
          data-testid="btn-poursuivre"
        />
      </div>

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
