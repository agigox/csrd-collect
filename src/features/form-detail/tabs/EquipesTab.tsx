"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, Divider } from "@rte-ds/react";
import type { FormTemplate } from "@/models/FormTemplate";
import {
  fetchTemplateTeams,
  assignTeamsToTemplate,
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
              <div className="py-3 px-2 text-base">{team.name}</div>
              <Divider appearance="default" orientation="horizontal" />
            </div>
          ))}
        </div>
      )}

      <AttribuerEquipesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentTeams={teams}
        onValidate={handleValidate}
      />
    </div>
  );
}
