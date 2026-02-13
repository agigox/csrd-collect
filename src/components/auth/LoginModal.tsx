"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/lib/ui/dialog";
import { Button, Select } from "@rte-ds/react";
import { useAuthStore } from "@/stores";
import type { TeamInfo } from "@/models/TeamInfo";

// Mock data - à remplacer par des données API
const DIRECTIONS = ["Maintenance", "Production", "Qualité", "Logistique"];
const CENTRES = ["Aura", "Île-de-France", "Occitanie", "Bretagne"];
const GMRS = ["lorem", "ipsum", "dolor", "sit"];
const EQUIPES = ["Emasi", "Alpha", "Beta", "Gamma"];

const toOptions = (items: string[]) =>
  items.map((item) => ({ value: item, label: item }));

interface LoginModalProps {
  open: boolean;
}

const LoginModal = ({ open }: LoginModalProps) => {
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState<TeamInfo>({
    direction: "",
    centre: "",
    gmr: "",
    equipe: "",
  });

  // Direction et Centre sont requis, GMR et Equipe sont optionnels
  const isFormValid = formData.direction && formData.centre;

  const handleSubmit = () => {
    if (isFormValid) {
      login(formData);
    }
  };

  const handleChange = (field: keyof TeamInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Bienvenue sur le collecteur</DialogTitle>
          <DialogDescription>
            Avant de commencer, veuillez renseigner votre équipe
            d&apos;appartenance.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Select
            id="direction"
            label="Direction"
            value={formData.direction}
            onChange={(value) => handleChange("direction", value)}
            options={toOptions(DIRECTIONS)}
            required
          />

          <Select
            id="centre"
            label="Centre maintenance"
            value={formData.centre}
            onChange={(value) => handleChange("centre", value)}
            options={toOptions(CENTRES)}
            required
          />

          <Select
            id="gmr"
            label="GMR (optionnel)"
            value={formData.gmr}
            onChange={(value) => handleChange("gmr", value)}
            options={toOptions(GMRS)}
            showResetButton
            onClear={() => handleChange("gmr", "")}
          />

          <Select
            id="equipe"
            label="Equipe (optionnel)"
            value={formData.equipe}
            onChange={(value) => handleChange("equipe", value)}
            options={toOptions(EQUIPES)}
            showResetButton
            onClear={() => handleChange("equipe", "")}
          />
        </div>

        <div className="flex justify-end mt-4">
          <Button
            label="Valider"
            onClick={handleSubmit}
            disabled={!isFormValid}
            variant="primary"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
