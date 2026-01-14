"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/lib/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select";
import { Button } from "@/lib/components/ui/button";
import { Label } from "@/lib/components/ui/label";
import { useAuthStore, type TeamInfo } from "@/stores";

// Mock data - à remplacer par des données API
const DIRECTIONS = ["Maintenance", "Production", "Qualité", "Logistique"];
const CENTRES = ["Aura", "Île-de-France", "Occitanie", "Bretagne"];
const GMRS = ["lorem", "ipsum", "dolor", "sit"];
const EQUIPES = ["Emasi", "Alpha", "Beta", "Gamma"];

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
          <div className="flex flex-col gap-2">
            <Label htmlFor="direction">Direction</Label>
            <Select
              value={formData.direction}
              onValueChange={(value) => handleChange("direction", value)}
            >
              <SelectTrigger id="direction" className="w-full">
                <SelectValue placeholder="Sélectionner une direction" />
              </SelectTrigger>
              <SelectContent>
                {DIRECTIONS.map((dir) => (
                  <SelectItem key={dir} value={dir}>
                    {dir}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="centre">Centre maintenance</Label>
            <Select
              value={formData.centre}
              onValueChange={(value) => handleChange("centre", value)}
            >
              <SelectTrigger id="centre" className="w-full">
                <SelectValue placeholder="Sélectionner un centre" />
              </SelectTrigger>
              <SelectContent>
                {CENTRES.map((centre) => (
                  <SelectItem key={centre} value={centre}>
                    {centre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="gmr">
              GMR{" "}
              <span className="text-muted-foreground text-xs">(optionnel)</span>
            </Label>
            <Select
              value={formData.gmr}
              onValueChange={(value) => handleChange("gmr", value)}
            >
              <SelectTrigger
                id="gmr"
                className="w-full"
                clearable
                hasValue={!!formData.gmr}
                onClear={() => handleChange("gmr", "")}
              >
                <SelectValue placeholder="Sélectionner un GMR" />
              </SelectTrigger>
              <SelectContent>
                {GMRS.map((gmr) => (
                  <SelectItem key={gmr} value={gmr}>
                    {gmr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="equipe">
              Equipe{" "}
              <span className="text-muted-foreground text-xs">(optionnel)</span>
            </Label>
            <Select
              value={formData.equipe}
              onValueChange={(value) => handleChange("equipe", value)}
            >
              <SelectTrigger
                id="equipe"
                className="w-full"
                clearable
                hasValue={!!formData.equipe}
                onClear={() => handleChange("equipe", "")}
              >
                <SelectValue placeholder="Sélectionner une équipe" />
              </SelectTrigger>
              <SelectContent>
                {EQUIPES.map((equipe) => (
                  <SelectItem key={equipe} value={equipe}>
                    {equipe}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            Valider
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
