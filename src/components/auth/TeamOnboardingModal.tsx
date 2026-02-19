"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Select } from "@rte-ds/react";
import { useAuthStore } from "@/stores";
import {
  fetchDirections,
  fetchMaintenanceCenters,
  fetchGmrs,
  fetchTeams,
} from "@/api/users";
import type { OrgUnit, TeamInfo } from "@/models/User";

const toOptions = (items: OrgUnit[]) =>
  items.map((item) => ({ value: item.id, label: item.name }));

export default function TeamOnboardingModal() {
  const updateTeamInfo = useAuthStore((s) => s.updateTeamInfo);

  // Selections (id + label pairs)
  const [directionId, setDirectionId] = useState("");
  const [directionName, setDirectionName] = useState("");
  const [centreId, setCentreId] = useState("");
  const [centreName, setCentreName] = useState("");
  const [gmrId, setGmrId] = useState("");
  const [gmrName, setGmrName] = useState("");
  const [equipeId, setEquipeId] = useState("");
  const [equipeName, setEquipeName] = useState("");

  // Options lists
  const [directions, setDirections] = useState<OrgUnit[]>([]);
  const [centres, setCentres] = useState<OrgUnit[]>([]);
  const [gmrsList, setGmrsList] = useState<OrgUnit[]>([]);
  const [equipes, setEquipes] = useState<OrgUnit[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch directions on mount
  useEffect(() => {
    fetchDirections()
      .then(setDirections)
      .catch(console.error);
  }, []);

  // Fetch centres when direction changes
  useEffect(() => {
    if (!directionId) {
      setCentres([]);
      return;
    }
    fetchMaintenanceCenters(directionId)
      .then(setCentres)
      .catch(console.error);
  }, [directionId]);

  // Fetch GMRs when centre changes
  useEffect(() => {
    if (!centreId) {
      setGmrsList([]);
      return;
    }
    fetchGmrs(centreId)
      .then(setGmrsList)
      .catch(console.error);
  }, [centreId]);

  // Fetch teams when GMR changes
  useEffect(() => {
    if (!gmrId) {
      setEquipes([]);
      return;
    }
    fetchTeams(gmrId)
      .then(setEquipes)
      .catch(console.error);
  }, [gmrId]);

  const handleDirectionChange = (value: string) => {
    const found = directions.find((d) => d.id === value);
    setDirectionId(value);
    setDirectionName(found?.name || "");
    // Reset downstream
    setCentreId("");
    setCentreName("");
    setGmrId("");
    setGmrName("");
    setEquipeId("");
    setEquipeName("");
  };

  const handleCentreChange = (value: string) => {
    const found = centres.find((c) => c.id === value);
    setCentreId(value);
    setCentreName(found?.name || "");
    // Reset downstream
    setGmrId("");
    setGmrName("");
    setEquipeId("");
    setEquipeName("");
  };

  const handleGmrChange = (value: string) => {
    const found = gmrsList.find((g) => g.id === value);
    setGmrId(value);
    setGmrName(found?.name || "");
    // Reset downstream
    setEquipeId("");
    setEquipeName("");
  };

  const handleEquipeChange = (value: string) => {
    const found = equipes.find((e) => e.id === value);
    setEquipeId(value);
    setEquipeName(found?.name || "");
  };

  const isFormValid =
    directionId && centreId && gmrId && equipeId;

  const handleValidate = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    try {
      const teamInfo: TeamInfo = {
        directionId,
        direction: directionName,
        maintenanceCenterId: centreId,
        centre: centreName,
        gmrId,
        gmr: gmrName,
        equipeId,
        equipe: equipeName,
      };
      await updateTeamInfo(teamInfo);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      id="team-onboarding"
      isOpen={true}
      onClose={() => {
        // X close button dismisses without saving — modal re-shows on next visit
      }}
      title="Bienvenue sur le collecteur"
      description="Avant de commencer, veuillez renseigner votre équipe d'appartenance."
      size="s"
      primaryButton={
        <Button
          variant="primary"
          label={isSubmitting ? "Validation..." : "Valider"}
          onClick={handleValidate}
          disabled={!isFormValid || isSubmitting}
          data-testid="btn-valider"
        />
      }
    >
      <div className="flex flex-col gap-4">
        <Select
          id="direction"
          label="Direction"
          value={directionId}
          onChange={handleDirectionChange}
          options={toOptions(directions)}
          required
          showResetButton
          onClear={() => handleDirectionChange("")}
          data-testid="select-direction"
        />

        {directionId && (
          <Select
            id="centre"
            label="Centre maintenance"
            value={centreId}
            onChange={handleCentreChange}
            options={toOptions(centres)}
            required
            showResetButton
            onClear={() => handleCentreChange("")}
            data-testid="select-centre"
          />
        )}

        {centreId && (
          <Select
            id="gmr"
            label="GMR"
            value={gmrId}
            onChange={handleGmrChange}
            options={toOptions(gmrsList)}
            required
            showResetButton
            onClear={() => handleGmrChange("")}
            data-testid="select-gmr"
          />
        )}

        {gmrId && (
          <Select
            id="equipe"
            label="Equipe"
            value={equipeId}
            onChange={handleEquipeChange}
            options={toOptions(equipes)}
            required
            showResetButton
            onClear={() => handleEquipeChange("")}
            data-testid="select-equipe"
          />
        )}
      </div>
    </Modal>
  );
}
