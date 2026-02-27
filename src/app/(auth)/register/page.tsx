"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput, Button } from "@rte-ds/react";
import Link from "next/link";

const NNI_REGEX = /^[a-zA-Z0-9]{1,10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterStep1Page() {
  const router = useRouter();

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [nni, setNni] = useState("");
  const [email, setEmail] = useState("");
  const [nniTouched, setNniTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const isNniValid = NNI_REGEX.test(nni);
  const isEmailValid = EMAIL_REGEX.test(email);
  const isFormValid = isNniValid && isEmailValid;

  const getNniError = (): string | undefined => {
    if (!nniTouched || nni === "") return undefined;
    if (!isNniValid)
      return "Le NNI doit contenir uniquement des caractères alphanumériques (max 10)";
    return undefined;
  };

  const getEmailError = (): string | undefined => {
    if (!emailTouched || email === "") return undefined;
    if (!isEmailValid) return "Veuillez saisir une adresse email valide";
    return undefined;
  };

  const nniError = getNniError();
  const emailError = getEmailError();

  const handleContinue = () => {
    if (!isFormValid) return;

    const params = new URLSearchParams();
    params.set("nni", nni);
    params.set("email", email);
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
        id="nni"
        label="NNI"
        value={nni}
        onChange={(value) => setNni(value)}
        onBlur={() => setNniTouched(true)}
        required
        error={!!nniError}
        assistiveTextLabel={nniError}
        assistiveAppearance={nniError ? "error" : "description"}
        data-testid="input-nni"
        width="100%"
      />

      <TextInput
        id="email"
        label="Email"
        value={email}
        onChange={(value) => setEmail(value)}
        onBlur={() => setEmailTouched(true)}
        required
        error={!!emailError}
        assistiveTextLabel={emailError}
        assistiveAppearance={emailError ? "error" : "description"}
        data-testid="input-email"
        width="100%"
      />

      <div className="pt-6 w-full">
        <Button
          label="Poursuivre"
          onClick={handleContinue}
          disabled={!isFormValid}
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
