"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TextInput, Button } from "@rte-ds/react";
import Link from "next/link";

const NNI_REGEX = /^[a-zA-Z0-9]{1,10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterStep1Form() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Restore values from query params (when coming back from step 2)
  const [lastName, setLastName] = useState(searchParams.get("lastName") || "");
  const [firstName, setFirstName] = useState(searchParams.get("firstName") || "");
  const [nni, setNni] = useState(searchParams.get("nni") || "");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [nniTouched, setNniTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [lastNameTouched, setLastNameTouched] = useState(false);
  const [firstNameTouched, setFirstNameTouched] = useState(false);

  const isNniValid = NNI_REGEX.test(nni);
  const isEmailValid = EMAIL_REGEX.test(email);
  const isLastNameValid = lastName.trim().length > 0;
  const isFirstNameValid = firstName.trim().length > 0;
  const isFormValid = isNniValid && isEmailValid && isLastNameValid && isFirstNameValid;

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

  const getLastNameError = (): string | undefined => {
    if (!lastNameTouched || lastName === "") return undefined;
    if (!isLastNameValid) return "Le nom est requis";
    return undefined;
  };

  const getFirstNameError = (): string | undefined => {
    if (!firstNameTouched || firstName === "") return undefined;
    if (!isFirstNameValid) return "Le prénom est requis";
    return undefined;
  };

  const nniError = getNniError();
  const emailError = getEmailError();
  const lastNameError = getLastNameError();
  const firstNameError = getFirstNameError();

  const handleContinue = () => {
    // Touch all fields to show errors
    setNniTouched(true);
    setEmailTouched(true);
    setLastNameTouched(true);
    setFirstNameTouched(true);
    if (!isFormValid) return;

    const params = new URLSearchParams();
    params.set("nni", nni);
    params.set("email", email);
    params.set("lastName", lastName);
    params.set("firstName", firstName);

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
          onChange={(value) => {
            setLastName(value);
            if (!lastNameTouched) setLastNameTouched(true);
          }}
          onBlur={() => setLastNameTouched(true)}
          required
          showRightIcon={false}
          error={!!lastNameError}
          assistiveTextLabel={lastNameError}
          assistiveAppearance={lastNameError ? "error" : "description"}
          data-testid="input-lastName"
          width="100%"
        />
        <TextInput
          id="firstName"
          label="Prénom"
          value={firstName}
          onChange={(value) => {
            setFirstName(value);
            if (!firstNameTouched) setFirstNameTouched(true);
          }}
          onBlur={() => setFirstNameTouched(true)}
          required
          showRightIcon={false}
          error={!!firstNameError}
          assistiveTextLabel={firstNameError}
          assistiveAppearance={firstNameError ? "error" : "description"}
          data-testid="input-firstName"
          width="100%"
        />
      </div>

      <TextInput
        id="nni"
        label="NNI"
        value={nni}
        onChange={(value) => {
          setNni(value);
          if (!nniTouched) setNniTouched(true);
        }}
        onBlur={() => setNniTouched(true)}
        required
        showRightIcon={false}
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
        onChange={(value) => {
          setEmail(value);
          if (!emailTouched) setEmailTouched(true);
        }}
        onBlur={() => setEmailTouched(true)}
        required
        showRightIcon={false}
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

export default function RegisterStep1Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-gray-500">Chargement...</div>
        </div>
      }
    >
      <RegisterStep1Form />
    </Suspense>
  );
}
