"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput, Button, RadioButtonGroup } from "@rte-ds/react";
import Link from "next/link";
import type { UserRole } from "@/models/User";

export default function RegisterStep1Page() {
  const router = useRouter();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [nniOrEmail, setNniOrEmail] = useState("");
  const [role, setRole] = useState<UserRole>("member");

  // Validate NNI (5 alphanumeric uppercase) or email
  const isNni = /^[A-Z0-9]{5}$/.test(nniOrEmail);
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nniOrEmail);
  const isFieldValid = isNni || isEmail;

  const handleContinue = () => {
    if (!isFieldValid) return;

    // Pass data to step 2 via searchParams
    const params = new URLSearchParams();
    params.set("nniOrEmail", nniOrEmail);
    params.set("role", role);
    if (nom) params.set("nom", nom);
    if (prenom) params.set("prenom", prenom);

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

      <div className="flex gap-2.5 w-full">
        <TextInput
          id="nom"
          label="Nom"
          value={nom}
          onChange={(value) => setNom(value)}
          data-testid="input-nom"
        />
        <TextInput
          id="prenom"
          label="Prénom"
          value={prenom}
          onChange={(value) => setPrenom(value)}
          data-testid="input-prenom"
        />
      </div>

      <TextInput
        id="nni-email"
        label="Email ou NNI"
        value={nniOrEmail}
        onChange={(value) => setNniOrEmail(value)}
        required
        data-testid="input-nni-email"
        width="100%"
      />

      <div className="w-full mt-2">
        <RadioButtonGroup
          groupName="role-selector"
          groupTitle="Rôle"
          showGroupTitle
          items={["Membre", "Administrateur"]}
          value={role === "member" ? "Membre" : "Administrateur"}
          onChange={(value) => setRole(value === "Membre" ? "member" : "admin")}
          direction="horizontal"
          data-testid="role-selector"
        />
      </div>

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

      <div className="flex items-end justify-center w-full h-12">
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
