"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Select } from "@rte-ds/react";
import { useAuthStore } from "@/stores";
import {
  fetchDirections,
  fetchMaintenanceCenters,
  fetchGmrs,
  fetchTeams,
  fetchTeamsByMC,
} from "@/api/users";
import type { OrgUnit, Team } from "@/models/User";

const toOptions = (items: OrgUnit[]) =>
  items.map((item) => ({ value: item.id, label: item.name }));

export default function TeamOnboardingModal() {
  const updateTeam = useAuthStore((s) => s.updateTeam);

  // Selections (id + label pairs)
  const [directionId, setDirectionId] = useState("");
  const [directionName, setDirectionName] = useState("");
  const [centreId, setCentreId] = useState("");
  const [centreName, setCentreName] = useState("");
  const [gmrId, setGmrId] = useState("");
  const [gmrName, setGmrName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [teamName, setTeamName] = useState("");

  // Options lists
  const [directions, setDirections] = useState<OrgUnit[]>([]);
  const [centres, setCentres] = useState<OrgUnit[]>([]);
  const [gmrsList, setGmrsList] = useState<OrgUnit[]>([]);
  const [teams, setTeams] = useState<OrgUnit[]>([]);
  const [hasGmrs, setHasGmrs] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch directions on mount
  useEffect(() => {
    fetchDirections().then(setDirections).catch(console.error);
  }, []);

  // Fetch centres when direction changes
  useEffect(() => {
    if (!directionId) {
      setCentres([]);
      return;
    }
    fetchMaintenanceCenters(directionId).then(setCentres).catch(console.error);
  }, [directionId]);

  // Fetch GMRs when centre changes; if none, fetch teams directly under MC
  useEffect(() => {
    if (!centreId) {
      setGmrsList([]);
      setTeams([]);
      setHasGmrs(true);
      return;
    }
    fetchGmrs(centreId)
      .then((gmrs) => {
        if (gmrs.length > 0) {
          setGmrsList(gmrs);
          setHasGmrs(true);
          setTeams([]);
        } else {
          setGmrsList([]);
          setHasGmrs(false);
          // No GMRs — fetch teams directly under this MC
          fetchTeamsByMC(centreId).then(setTeams).catch(console.error);
        }
      })
      .catch(console.error);
  }, [centreId]);

  // Fetch teams when GMR changes (only when GMR level exists)
  useEffect(() => {
    if (!gmrId || !hasGmrs) {
      if (hasGmrs) setTeams([]);
      return;
    }
    fetchTeams(gmrId).then(setTeams).catch(console.error);
  }, [gmrId, hasGmrs]);

  const handleDirectionChange = (value: string) => {
    const found = directions.find((d) => d.id === value);
    setDirectionId(value);
    setDirectionName(found?.name || "");
    // Reset downstream
    setCentreId("");
    setCentreName("");
    setGmrId("");
    setGmrName("");
    setTeamId("");
    setTeamName("");
  };

  const handleCentreChange = (value: string) => {
    const found = centres.find((c) => c.id === value);
    setCentreId(value);
    setCentreName(found?.name || "");
    // Reset downstream
    setGmrId("");
    setGmrName("");
    setTeamId("");
    setTeamName("");
  };

  const handleGmrChange = (value: string) => {
    const found = gmrsList.find((g) => g.id === value);
    setGmrId(value);
    setGmrName(found?.name || "");
    // Reset downstream
    setTeamId("");
    setTeamName("");
  };

  const handleTeamChange = (value: string) => {
    const found = teams.find((e) => e.id === value);
    setTeamId(value);
    setTeamName(found?.name || "");
  };

  const isFormValid = directionId && centreId && teamId && (hasGmrs ? gmrId : true);

  const handleValidate = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    try {
      const team: Team = {
        directionId,
        direction: directionName,
        maintenanceCenterId: centreId,
        centre: centreName,
        gmrId: gmrId || undefined,
        gmr: gmrName || undefined,
        teamId,
        team: teamName,
      };
      await updateTeam(team);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`#team-onboarding [data-testid="modal-close-button"] { display: none; }`}</style>
      <Modal
        id="team-onboarding"
        isOpen={true}
        onClose={() => {}}
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
        showCloseIcon={false}
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
            width={280}
          />

          {directionId && (
            <Select
              id="centre"
              label="Département/CM"
              value={centreId}
              onChange={handleCentreChange}
              options={toOptions(centres)}
              required
              showResetButton
              onClear={() => handleCentreChange("")}
              data-testid="select-centre"
              width={280}
            />
          )}

          {centreId && hasGmrs && (
            <Select
              id="gmr"
              label="Service/GMR"
              value={gmrId}
              onChange={handleGmrChange}
              options={toOptions(gmrsList)}
              required
              showResetButton
              onClear={() => handleGmrChange("")}
              data-testid="select-gmr"
              width={280}
            />
          )}

          {(gmrId || (centreId && !hasGmrs)) && (
            <Select
              id="team"
              label="Equipe"
              value={teamId}
              onChange={handleTeamChange}
              options={toOptions(teams)}
              required
              showResetButton
              onClear={() => handleTeamChange("")}
              data-testid="select-team"
              width={280}
            />
          )}
        </div>
      </Modal>
    </>
  );
}
