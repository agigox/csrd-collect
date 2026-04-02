"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, Divider, IconButton, Modal } from "@rte-ds/react";
import type { FormTemplate } from "@/models/FormTemplate";
import {
  fetchTemplateTeams,
  assignTeamsToTemplate,
  removeTeamFromTemplate,
} from "@/api/forms";
import AttribuerEquipesModal from "./AttribuerEquipesModal";

interface TeamInfo {
  id: string;
  name: string;
}

interface EquipesTabProps {
  form: FormTemplate;
}

export function EquipesTab({ form }: EquipesTabProps) {
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamToRemove, setTeamToRemove] = useState<TeamInfo | null>(null);

  const loadTeams = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchTemplateTeams(form.id);
      setTeams(result.map((t) => ({ id: t.id, name: t.name })));
    } catch (err) {
      console.error("Failed to load teams:", err);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }, [form.id]);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  async function handleValidate(newTeams: TeamInfo[]) {
    try {
      const newTeamIds = newTeams.map((t) => t.id);
      await assignTeamsToTemplate(form.id, newTeamIds);
      setTeams(newTeams);
    } catch (err) {
      console.error("Failed to assign teams:", err);
    }
    setIsModalOpen(false);
  }

  async function handleConfirmRemove() {
    if (!teamToRemove) return;
    try {
      await removeTeamFromTemplate(form.id, teamToRemove.id);
      setTeams((prev) => prev.filter((t) => t.id !== teamToRemove.id));
    } catch (err) {
      console.error("Failed to remove team:", err);
    } finally {
      setTeamToRemove(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Chargement...</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="heading-s">{teams.length} équipe(s)</span>
        <Button
          variant="secondary"
          size="m"
          label="Attribuer"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      {/* Team list */}
      {teams.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune équipe attribuée</p>
      ) : (
        <div className="flex flex-col">
          {teams.map((team) => (
            <div key={team.id}>
              <div className="py-3 px-2 text-base flex items-center justify-between">
                <span>{team.name}</span>
                <IconButton
                  aria-label={`Retirer ${team.name}`}
                  name="delete"
                  size="m"
                  variant="neutral"
                  onClick={() => setTeamToRemove(team)}
                  iconColor="#ED1C1C"
                />
              </div>
              <Divider appearance="default" orientation="horizontal" />
            </div>
          ))}
        </div>
      )}

      <Modal
        id="confirm-remove-team"
        isOpen={teamToRemove !== null}
        onClose={() => setTeamToRemove(null)}
        title="Retirer l'équipe"
        size="s"
        primaryButton={
          <Button
            variant="danger"
            label="Retirer"
            onClick={handleConfirmRemove}
          />
        }
        secondaryButton={
          <Button
            variant="secondary"
            label="Annuler"
            onClick={() => setTeamToRemove(null)}
          />
        }
      >
        <p>
          Voulez-vous retirer l'équipe <strong>{teamToRemove?.name}</strong> de
          ce formulaire ?
        </p>
      </Modal>

      <AttribuerEquipesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentTeams={teams}
        onValidate={handleValidate}
      />
    </div>
  );
}
